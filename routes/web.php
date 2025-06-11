<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Tenant\TenantController;

Route::get('/', function () {
    return Inertia::render('www/index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('/admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('app/dashboard/page');
        })->name('dashboard');
    });
    
});

Route::get('/customer/register', [TenantController::class, 'showRegistrationForm'])->name('tenant.register');
Route::post('/customer/register', [TenantController::class, 'register']);
Route::get('/customer/registered/{domain}', [TenantController::class, 'registered'])->name('tenant.registered');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


Route::resource('posts', App\Http\Controllers\PostController::class)->only('index', 'store');
