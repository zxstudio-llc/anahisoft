<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'company_logo',
        'company_address',
        'company_phone',
        'company_email',
        'company_tax_id',
        'currency',
        'timezone',
        // SUNAT fields
        'ruc',
        'business_name',
        'trade_name',
        'status',
        'condition',
        'address',
        'department',
        'province',
        'district',
        'registration_date',
        'emission_system',
        'accounting_system',
        'foreign_trade_activity',
        'economic_activities',
        'payment_vouchers',
        'electronic_systems',
        'electronic_emission_date',
        'electronic_vouchers',
        'ple_date',
        'registries',
        'withdrawal_date',
        'profession',
        'ubigeo',
        'capital',
        'additional_settings',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'registration_date' => 'date',
        'electronic_emission_date' => 'date',
        'ple_date' => 'date',
        'withdrawal_date' => 'date',
        'economic_activities' => 'array',
        'payment_vouchers' => 'array',
        'electronic_systems' => 'array',
        'electronic_vouchers' => 'array',
        'registries' => 'array',
        'additional_settings' => 'array',
        'capital' => 'decimal:2',
    ];
}
