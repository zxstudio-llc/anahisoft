<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TenantHomeController extends Controller
{
    public function __invoke()
    {
        // Si el usuario está autenticado, redirigir al dashboard
        if (Auth::check()) {
            return redirect()->route('tenant.dashboard');
        }

        // Si no está autenticado, redirigir al login o onboarding
        return redirect()->route('tenant.login'); // o 'tenant.onboarding' según tu flujo
    }
}
