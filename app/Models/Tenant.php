<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;



    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'data',
        'subscription_plan_id',
        'trial_ends_at',
        'is_active',
        'subscription_active',
        'subscription_ends_at',
    ];
    
    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
        'trial_ends_at' => 'datetime',
        'subscription_ends_at' => 'datetime',
        'is_active' => 'boolean',
        'subscription_active' => 'boolean',
    ];
    
    /**
     * Relación con el plan de suscripción
     */
    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }
    
    /**
     * Relación con los pagos
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
    
    /**
     * Obtiene el plan de suscripción asociado
     * 
     * @return \App\Models\SubscriptionPlan|null
     */
    public function getSubscriptionPlanAttribute()
    {
        if (!$this->subscription_plan_id) {
            return null;
        }
        
        // Usar tenancy()->central() para acceder a la base de datos central
        return tenancy()->central(function () {
            return SubscriptionPlan::find($this->subscription_plan_id);
        });
    }
    
    /**
     * Verifica si el tenant tiene una suscripción activa
     */
    public function hasActiveSubscription(): bool
    {
        if ($this->onTrial()) {
            return true;
        }
        
        return $this->subscription_active && 
               ($this->subscription_ends_at === null || $this->subscription_ends_at->isFuture());
    }
    
    /**
     * Verifica si el tenant está en periodo de prueba
     */
    public function onTrial(): bool
    {
        return $this->trial_ends_at !== null && $this->trial_ends_at->isFuture();
    }

    public function details()
    {
        return $this->hasOne(TenantDetail::class);
    }
}