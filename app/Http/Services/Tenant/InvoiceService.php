<?php

namespace App\Http\Services\Tenant;

use App\Models\Tenant\InvoiceUsage;
use Illuminate\Support\Facades\Log;
use App\Models\Tenant\Subscription;
use Carbon\Carbon;

class InvoiceService
{
    /**
     * Incrementa el contador de facturas
     * 
     * @return bool
     */
    public function incrementInvoiceCount(): bool
    {
        try {
            $invoiceUsage = $this->getOrCreateInvoiceUsage();
            return $invoiceUsage->incrementInvoiceCount();
        } catch (\Exception $e) {
            Log::error('Error incrementando contador de facturas: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Verifica si se ha alcanzado el límite de facturas
     * 
     * @return bool
     */
    public function hasReachedLimit(): bool
    {
        $invoiceUsage = InvoiceUsage::first();
        
        if (!$invoiceUsage) {
            return false;
        }
        
        // Si el límite es 0, significa que no hay límite
        if ($invoiceUsage->limit === 0) {
            return false;
        }
        
        // Verificar si necesitamos reiniciar el contador mensual
        $now = Carbon::now();
        $lastReset = Carbon::parse($invoiceUsage->last_reset);
        
        if ($lastReset->month != $now->month || $lastReset->year != $now->year) {
            $invoiceUsage->monthly_invoices = 0;
            $invoiceUsage->last_reset = $now->startOfMonth();
            $invoiceUsage->save();
        }
        
        return $invoiceUsage->monthly_invoices >= $invoiceUsage->limit;
    }
    
    /**
     * Obtiene o crea el registro de uso de facturas
     * 
     * @return InvoiceUsage
     */
    private function getOrCreateInvoiceUsage(): InvoiceUsage
    {
        $invoiceUsage = InvoiceUsage::first();
        
        if (!$invoiceUsage) {
            $tenant = tenant();
            $limit = 0;
            
            if ($tenant && $tenant->subscriptionPlan) {
                $limit = $tenant->subscriptionPlan->invoice_limit;
            }
            
            $invoiceUsage = InvoiceUsage::create([
                'total_invoices' => 0,
                'monthly_invoices' => 0,
                'limit' => $limit,
                'last_reset' => now(),
            ]);
        }
        
        return $invoiceUsage;
    }
    
    /**
     * Obtiene estadísticas de uso de facturas
     * 
     * @return array
     */
    public function getUsageStatistics(): array
    {
        try {
            $invoiceUsage = $this->getOrCreateInvoiceUsage();
            
            return [
                'total' => $invoiceUsage->total_invoices,
                'monthly' => $invoiceUsage->monthly_invoices,
                'limit' => $invoiceUsage->limit,
                'percentage' => $invoiceUsage->getUsagePercentage(),
                'remaining' => $invoiceUsage->getRemainingDocuments(),
                'unlimited' => $invoiceUsage->limit === 0,
                'last_reset' => $invoiceUsage->last_reset->format('Y-m-d'),
                'next_reset' => $invoiceUsage->last_reset->copy()->addMonth()->startOfMonth()->format('Y-m-d'),
            ];
        } catch (\Exception $e) {
            Log::error('Error obteniendo estadísticas de uso: ' . $e->getMessage());
            return [
                'error' => 'No se pudieron obtener las estadísticas de uso',
            ];
        }
    }
    
    /**
     * Actualiza el límite de facturas según el plan de suscripción
     * 
     * @param int $newLimit
     * @return bool
     */
    public function updateInvoiceLimit(int $newLimit): bool
    {
        try {
            $invoiceUsage = $this->getOrCreateInvoiceUsage();
            return $invoiceUsage->updateLimit($newLimit);
        } catch (\Exception $e) {
            Log::error('Error actualizando límite de facturas: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Verifica si el tenant tiene una suscripción activa
     * 
     * @return bool
     */
    public function hasActiveSubscription(): bool
    {
        $tenant = tenant();
        return $tenant && $tenant->hasActiveSubscription();
    }
    
    /**
     * Obtiene el plan de suscripción actual
     * 
     * @return array|null
     */
    public function getCurrentSubscriptionPlan(): ?array
    {
        $tenant = tenant();
        
        if (!$tenant) {
            return null;
        }
        
        // Acceder al plan de suscripción desde la base de datos central
        $subscriptionPlan = tenancy()->central(function () use ($tenant) {
            if (!$tenant->subscription_plan_id) {
                return null;
            }
            return \App\Models\SubscriptionPlan::find($tenant->subscription_plan_id);
        });
        
        if (!$subscriptionPlan) {
            return null;
        }
        
        return [
            'id' => $subscriptionPlan->id,
            'name' => $subscriptionPlan->name,
            'price' => $subscriptionPlan->price,
            'billing_period' => $subscriptionPlan->billing_period,
            'invoice_limit' => $subscriptionPlan->invoice_limit,
            'features' => $subscriptionPlan->features,
        ];
    }

    /**
     * Obtiene el uso actual de facturas
     * 
     * @return array
     */
    public function getUsageData(): array
    {
        $invoiceUsage = InvoiceUsage::first();
        
        if (!$invoiceUsage) {
            // Crear un registro de uso si no existe
            $invoiceUsage = new InvoiceUsage();
            $invoiceUsage->total_invoices = 0;
            $invoiceUsage->monthly_invoices = 0;
            $invoiceUsage->limit = 0; // Sin límite por defecto
            $invoiceUsage->last_reset = Carbon::now()->startOfMonth();
            $invoiceUsage->save();
        }
        
        // Verificar si necesitamos reiniciar el contador mensual
        $now = Carbon::now();
        $lastReset = Carbon::parse($invoiceUsage->last_reset);
        
        if ($lastReset->month != $now->month || $lastReset->year != $now->year) {
            $invoiceUsage->monthly_invoices = 0;
            $invoiceUsage->last_reset = $now->startOfMonth();
            $invoiceUsage->save();
        }
        
        // Calcular el porcentaje de uso
        $percentage = $invoiceUsage->limit > 0 
            ? min(100, ($invoiceUsage->monthly_invoices / $invoiceUsage->limit) * 100) 
            : 0;
        
        // Calcular documentos restantes
        $remaining = $invoiceUsage->limit > 0 
            ? max(0, $invoiceUsage->limit - $invoiceUsage->monthly_invoices) 
            : 0;
        
        // Calcular fecha del próximo reinicio
        $nextReset = $lastReset->copy()->addMonth()->startOfMonth();
        
        return [
            'total' => $invoiceUsage->total_invoices,
            'monthly' => $invoiceUsage->monthly_invoices,
            'limit' => $invoiceUsage->limit,
            'percentage' => $percentage,
            'remaining' => $remaining,
            'unlimited' => $invoiceUsage->limit === 0,
            'last_reset' => $invoiceUsage->last_reset->format('Y-m-d'),
            'next_reset' => $nextReset->format('Y-m-d'),
        ];
    }
    
    /**
     * Incrementa los contadores de uso de facturas
     * 
     * @return bool
     */
    public function incrementUsage(): bool
    {
        $invoiceUsage = InvoiceUsage::first();
        
        if (!$invoiceUsage) {
            // Crear un registro de uso si no existe
            $invoiceUsage = new InvoiceUsage();
            $invoiceUsage->total_invoices = 0;
            $invoiceUsage->monthly_invoices = 0;
            $invoiceUsage->limit = 0; // Sin límite por defecto
            $invoiceUsage->last_reset = Carbon::now()->startOfMonth();
        }
        
        // Verificar si necesitamos reiniciar el contador mensual
        $now = Carbon::now();
        $lastReset = Carbon::parse($invoiceUsage->last_reset);
        
        if ($lastReset->month != $now->month || $lastReset->year != $now->year) {
            $invoiceUsage->monthly_invoices = 0;
            $invoiceUsage->last_reset = $now->startOfMonth();
        }
        
        // Incrementar los contadores
        $invoiceUsage->total_invoices += 1;
        $invoiceUsage->monthly_invoices += 1;
        
        return $invoiceUsage->save();
    }
} 