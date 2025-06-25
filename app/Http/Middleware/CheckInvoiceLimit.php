<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant\InvoiceUsage;
use Illuminate\Support\Facades\Log;

class CheckInvoiceLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Solo aplicar en contexto de tenant y solo para rutas de facturación o API
        if (!$request->isTenant() || !$this->isInvoiceRelatedRoute($request)) {
            return $next($request);
        }
        
        try {
            // Obtener el tenant actual
            $tenant = tenant();
            
            if (!$tenant || !$tenant->hasActiveSubscription()) {
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Su suscripción ha expirado o no está activa. Por favor, renueve su suscripción para continuar.',
                        'subscription_expired' => true
                    ], 403);
                }
                
                return redirect()->route('subscription.expired');
            }
            
            // Obtener el uso de facturas
            $invoiceUsage = InvoiceUsage::first();
            
            // Si no existe, crear uno
            if (!$invoiceUsage) {
                $invoiceUsage = InvoiceUsage::create([
                    'total_invoices' => 0,
                    'monthly_invoices' => 0,
                    'limit' => $this->getInvoiceLimit(),
                    'last_reset' => now(),
                ]);
            }
            
            // Verificar si se ha alcanzado el límite
            if ($invoiceUsage->hasReachedLimit()) {
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ha alcanzado el límite de documentos permitido por su plan. Por favor, actualice su suscripción para continuar.',
                        'limit_reached' => true,
                        'current_usage' => $invoiceUsage->monthly_invoices,
                        'limit' => $invoiceUsage->limit,
                    ], 403);
                }
                
                return redirect()->route('tenant.subscription.upgrade')
                    ->with('error', 'Ha alcanzado el límite de documentos permitido por su plan. Por favor, actualice su suscripción para continuar.');
            }
        } catch (\Exception $e) {
            Log::error('Error en CheckInvoiceLimit: ' . $e->getMessage());
            
            // En caso de error, permitir la solicitud para evitar bloquear al usuario
            return $next($request);
        }
        
        return $next($request);
    }
    
    /**
     * Verifica si la ruta está relacionada con facturación o API
     */
    private function isInvoiceRelatedRoute(Request $request): bool
    {
        // Rutas relacionadas con facturación
        $invoiceRoutes = [
            'tenant.invoices.*',
            'tenant.api.invoices.*',
        ];
        
        // Verificar si es una ruta de API
        if ($request->is('api/v1/invoices*') || $request->is('api/v1/documents*')) {
            return true;
        }
        
        // Verificar rutas nombradas
        foreach ($invoiceRoutes as $route) {
            if ($request->routeIs($route)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Obtiene el límite de facturas según el plan de suscripción
     */
    private function getInvoiceLimit(): int
    {
        $tenant = tenant();
        
        if (!$tenant || !$tenant->subscriptionPlan) {
            return 0; // Sin límite por defecto
        }
        
        return $tenant->subscriptionPlan->invoice_limit;
    }
} 