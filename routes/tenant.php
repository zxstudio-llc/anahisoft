<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Controllers\Tenant\OnboardingController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\TenantHomeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\TenantAuthenticatedSessionController;


/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    'guest',
])->group(function () {
    Route::prefix('tenant')->group(function () {
        Route::get('/', TenantHomeController::class)->name('tenant.home');
    });
    Route::prefix('/onboarding')->name('tenant.')->group(function () {
        Route::get('/', [OnboardingController::class, 'show'])->name('onboarding');
        Route::post('/', [OnboardingController::class, 'store'])->name('onboarding.store');
    });
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
    
    Route::get('login', [TenantAuthenticatedSessionController::class, 'create'])
    ->name('tenant.login');

    Route::post('login', [TenantAuthenticatedSessionController::class, 'store']);
});


Route::middleware([
    'web',
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    'auth',
])->group(function () {
    Route::post('customer/logout', [TenantAuthenticatedSessionController::class, 'destroy'])
        ->name('tenant.logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('tenant.dashboard');
});