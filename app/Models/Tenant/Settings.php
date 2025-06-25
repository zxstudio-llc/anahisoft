<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    /**
     * Los atributos que son asignables en masa.
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
        'additional_settings',
    ];

    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'additional_settings' => 'array',
    ];
}