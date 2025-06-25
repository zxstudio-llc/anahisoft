<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Controllers\Tenant\OnboardingController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\TenantHomeController;
use App\Http\Controllers\Tenant\ClientController;
use App\Http\Controllers\Tenant\ProductController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\TenantAuthenticatedSessionController;
use App\Http\Controllers\Tenant\ApiKeyController;
use App\Http\Controllers\Tenant\CategoryController;
use App\Http\Controllers\Tenant\DocumentValidationController;
use App\Http\Controllers\Tenant\InvoiceController;
use Inertia\Inertia;

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
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {

        // Ruta principal - Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('tenant.dashboard');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');

        Route::resource('clients', ClientController::class, ['as' => 'tenant']);

        Route::resource('categories', CategoryController::class, ['as' => 'tenant']);

        Route::resource('products', ProductController::class, ['as' => 'tenant']);

        Route::post('/validate-document', [DocumentValidationController::class, 'validate'])
            ->name('validate-document');

            // version anterior

            // Route::prefix('tenant')->group(function () {
            //     Route::get('/', TenantHomeController::class)->name('tenant.home');
            // });
            
            // Route::prefix('customer')->name('tenant.')->group(function () {
            //     Route::get('/login', [TenantAuthenticatedSessionController::class, 'create'])->name('login');
            //     Route::post('/login', [TenantAuthenticatedSessionController::class, 'store']);
            // });

            // Route::prefix('onboarding')->name('tenant.')->group(function () {
            //     Route::get('/', [OnboardingController::class, 'show'])->name('onboarding');
            //     Route::post('/', [OnboardingController::class, 'store'])->name('onboarding.store');
            // });

            // fin version anterior

        Route::resource('api-keys', ApiKeyController::class, ['only' => ['index', 'store', 'destroy']]);
        // Route::get('api-keys/docs', function () {
        //     return Inertia::render('Tenant/ApiKeys/ApiDocs');
        // })->name('api-keys.docs');

        // Rutas para suscripciones
        Route::middleware(['auth'])->prefix('subscription')->name('subscription.')->group(function () {
            Route::get('/', [App\Http\Controllers\Tenant\SubscriptionController::class, 'index'])->name('index');
            Route::get('/upgrade', [App\Http\Controllers\Tenant\SubscriptionController::class, 'upgrade'])->name('upgrade');
            Route::post('/process-payment', [App\Http\Controllers\Tenant\SubscriptionController::class, 'processPayment'])->name('process-payment');
        });

        // Ruta para la página de suscripción expirada (accesible sin autenticación y sin verificación de suscripción)
        Route::get('/subscription/expired', [App\Http\Controllers\Tenant\SubscriptionController::class, 'expired'])
            ->name('subscription.expired')
            ->withoutMiddleware(['check.subscription']);

        // Rutas para facturación
        Route::prefix('invoices')->name('invoices.')->group(function () {
            Route::get('/', [App\Http\Controllers\Tenant\InvoiceController::class, 'index'])->name('index');
            Route::get('/create', [App\Http\Controllers\Tenant\InvoiceController::class, 'create'])->name('create');
            Route::post('/', [App\Http\Controllers\Tenant\InvoiceController::class, 'store'])->name('store');
            Route::get('/{invoice}', [App\Http\Controllers\Tenant\InvoiceController::class, 'show'])->name('show');
            Route::get('/{invoice}/edit', [App\Http\Controllers\Tenant\InvoiceController::class, 'edit'])->name('edit');
            Route::put('/{invoice}', [App\Http\Controllers\Tenant\InvoiceController::class, 'update'])->name('update');
            Route::delete('/{invoice}', [App\Http\Controllers\Tenant\InvoiceController::class, 'destroy'])->name('destroy');
            Route::get('/{invoice}/pdf', [App\Http\Controllers\Tenant\InvoiceController::class, 'generatePdf'])->name('pdf');
        });
    });

    require __DIR__ . '/settings.php';
    require __DIR__ . '/auth.php';
});