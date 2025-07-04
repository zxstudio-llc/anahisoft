<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\InvoiceUsage;
use App\Models\Tenant\Subscription;
use App\Http\Services\Tenant\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    protected InvoiceService $invoiceService;
    
    /**
     * Constructor
     */
    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }
    
    /**
     * Muestra la página de suscripción
     */
    public function index()
    {
        // Obtener el tenant actual
        $tenant = tenant();
        
        if (!$tenant) {
            return redirect()->route('subscription.expired');
        }
        
        // Obtener el plan de suscripción actual
        $currentPlan = $tenant->subscriptionPlan;
        
        // Obtener todos los planes disponibles desde la base de datos central
        $availablePlans = tenancy()->central(function () {
            return \App\Models\SubscriptionPlan::where('is_active', true)
                ->orderBy('price')
                ->get();
        });
        
        // Obtener el uso de facturas
        $invoiceUsage = InvoiceUsage::first();
        if (!$invoiceUsage) {
            $invoiceUsage = InvoiceUsage::create([
                'total_invoices' => 0,
                'monthly_invoices' => 0,
                'limit' => $currentPlan ? $currentPlan->invoice_limit : 0,
                'last_reset' => now(),
            ]);
        }
        
        // Obtener estadísticas de uso
        $usageStatistics = $this->invoiceService->getUsageStatistics();
        
        return Inertia::render('customer/subscription/Index', [
            'currentPlan' => $currentPlan,
            'availablePlans' => $availablePlans,
            'subscriptionStatus' => [
                'isActive' => $tenant->hasActiveSubscription(),
                'onTrial' => $tenant->onTrial(),
                'trialEndsAt' => $tenant->trial_ends_at,
                'subscriptionEndsAt' => $tenant->subscription_ends_at,
            ],
            'invoiceUsage' => $usageStatistics
        ]);
    }
    
    /**
     * Muestra la página para actualizar la suscripción
     */
    public function upgrade()
    {
        // Obtener el tenant actual
        $tenant = tenant();
        
        if (!$tenant) {
            return redirect()->route('subscription.expired');
        }
        
        // Obtener el plan de suscripción actual
        $currentPlan = $tenant->subscriptionPlan;
        
        // Obtener planes disponibles para actualizar desde la base de datos central
        $availablePlans = tenancy()->central(function () use ($currentPlan) {
            return \App\Models\SubscriptionPlan::where('is_active', true)
                ->when($currentPlan, function ($query) use ($currentPlan) {
                    return $query->where('price', '>=', $currentPlan->price);
                })
                ->orderBy('price')
                ->get();
        });
        
        // Obtener estadísticas de uso
        $usageStatistics = $this->invoiceService->getUsageStatistics();
        
        return Inertia::render('customer/subscription/Upgrade', [
            'currentPlan' => $currentPlan,
            'availablePlans' => $availablePlans,
            'subscriptionStatus' => [
                'isActive' => $tenant->hasActiveSubscription(),
                'onTrial' => $tenant->onTrial(),
                'trialEndsAt' => $tenant->trial_ends_at,
                'subscriptionEndsAt' => $tenant->subscription_ends_at,
            ],
            'invoiceUsage' => $usageStatistics
        ]);
    }
    
    /**
     * Procesa el pago de la suscripción
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'payment_method' => 'required|string',
            'billing_period' => 'required|in:monthly,yearly',
        ]);
        
        // Obtener el tenant actual
        $tenant = tenant();
        
        if (!$tenant) {
            return redirect()->route('subscription.expired');
        }
        
        // Obtener el plan seleccionado desde la base de datos central
        $plan = tenancy()->central(function () use ($validated) {
            return \App\Models\SubscriptionPlan::findOrFail($validated['plan_id']);
        });
        
        // Simular procesamiento de pago
        // En un caso real, aquí se integraría con un gateway de pago como Stripe, PayPal, etc.
        $paymentSuccessful = true;
        
        if ($paymentSuccessful) {
            // Actualizar la suscripción del tenant
            tenancy()->central(function () use ($tenant, $plan, $validated) {
                $tenant->subscription_plan_id = $plan->id;
                $tenant->subscription_active = true;
                
                // Determinar la fecha de finalización según el período de facturación
                if ($validated['billing_period'] === 'monthly') {
                    $tenant->subscription_ends_at = Carbon::now()->addMonth();
                } else {
                    $tenant->subscription_ends_at = Carbon::now()->addYear();
                }
                
                $tenant->save();
            });
            
            // Actualizar el límite de facturas
            $this->invoiceService->updateInvoiceLimit($plan->invoice_limit);
            
            // Registrar la suscripción en la tabla de suscripciones
            Subscription::create([
                'name' => $plan->name,
                'plan_type' => $validated['billing_period'],
                'ends_at' => $tenant->subscription_ends_at,
            ]);
            
            return redirect()->route('subscription.index')
                ->with('success', 'Suscripción actualizada correctamente');
        } else {
            return back()->withErrors([
                'payment' => 'Hubo un problema al procesar el pago. Por favor, inténtelo de nuevo.'
            ]);
        }
    }
    
    /**
     * Muestra la página de suscripción expirada
     */
    public function expired()
    {
        // Obtener todos los planes disponibles desde la base de datos central
        $availablePlans = tenancy()->central(function () {
            return \App\Models\SubscriptionPlan::where('is_active', true)
                ->orderBy('price')
                ->get();
        });
            
        return Inertia::render('customer/subscription/Expired', [
            'availablePlans' => $availablePlans
        ]);
    }
} 