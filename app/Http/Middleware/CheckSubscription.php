<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Solo aplicar en contexto de tenant
        if (!$request->isTenant()) {
            return $next($request);
        }

        // Rutas que están exentas de verificación de suscripción
        $exemptRoutes = [
            'subscription.expired',
            'subscription.index',
            'subscription.upgrade',
            'subscription.process-payment',
            'tenants.subscription',
            'tenants.update-subscription',
            'logout'
        ];

        // Verificar si la ruta actual está exenta
        foreach ($exemptRoutes as $route) {
            if ($request->routeIs($route)) {
                return $next($request);
            }
        }

        // Obtener el tenant actual
        $tenant = tenant();

        // Si no hay tenant, continuar (esto no debería ocurrir en contexto tenant)
        if (!$tenant) {
            return $next($request);
        }

        // Verificar si el tenant está activo y tiene una suscripción válida
        if (!$tenant->is_active || !$tenant->hasActiveSubscription()) {
            // Si es una solicitud AJAX o API
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Su suscripción ha expirado o no está activa. Por favor, renueve su suscripción para continuar.',
                    'subscription_expired' => true
                ], 403);
            }

            // Redirigir a la página de suscripción expirada
            return redirect()->route('subscription.expired');
        }

        return $next($request);
    }
} 