<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TenantHomeController extends Controller
{
    public function __invoke()
    {
        if (Auth::check()) {
            return redirect()->route('tenant.dashboard');
        }

        return redirect()->route('login'); 
    }
}
