<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TenantDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'domain_id',
        'plan_id',
        'company_name',
        'ruc',
        'email',
        'phone',
        'address',
        'legal_representative'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
