<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Tenant\TenantController;
use App\Http\Controllers\Security\RoleController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Web\SeoController;
use App\Http\Controllers\Web\AnalyticsController;
use App\Http\Controllers\Web\TestimonialController;
use App\Http\Controllers\Web\MenuController;
use App\Http\Controllers\Web\BannerController;
use App\Http\Controllers\Web\MenuItemController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Media\MediaController;
use App\Http\Controllers\Web\NewsController;
use App\Http\Controllers\Central\CentralTenantController;
use App\Http\Controllers\Central\DashboardController;
use App\Http\Controllers\Central\SubscriptionPlanController;
use App\Http\Controllers\Central\PaymentController;
use App\Http\Controllers\Settings\SiteSettingsController;
use App\Http\Controllers\Settings\ThemesController;
use App\Http\Controllers\Settings\FooterController;
use Illuminate\Support\Facades\Broadcast;


foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Broadcast::routes();
        Route::get('/', function () {
            return Inertia::render('www/index');
        })->name('home');

        Route::group(['prefix' => 'admin'], function () {
            Route::middleware(['auth', 'verified'])->group(function () {
                Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

                Route::prefix('')->name('admin.')->group(function () {
               
                Route::prefix('roles')->name('roles.')->group(function () {
                    Route::get('/', [RoleController::class, 'index'])->name('index');
                    Route::get('/create', [RoleController::class, 'create'])->name('create');
                    Route::post('/', [RoleController::class, 'store'])->name('store');
                    Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
                    Route::put('/{role}', [RoleController::class, 'update'])->name('update');
                    Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
                });
                Route::prefix('users')->name('users.')->middleware('can:manage_users')->group(function () {
                    Route::get('/', [UserController::class, 'index'])->name('index');
                    Route::get('/create', [UserController::class, 'create'])->name('create');
                    Route::post('/', [UserController::class, 'store'])->name('store');
                    Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
                    Route::put('/{user}', [UserController::class, 'update'])->name('update');
                });
                
                Route::resource('seo', \App\Http\Controllers\Web\SeoController::class)->names('seo');
            
                Route::prefix('pages')->name('pages.')->group(function () {
                    Route::get('/', [PageController::class, 'index'])->name('index');
                    Route::get('/create', [PageController::class, 'create'])->name('create');
                    Route::post('/', [PageController::class, 'store'])->name('store');
                    Route::prefix('/{page}')->group(function () {
                        Route::get('/edit', [PageController::class, 'edit'])->name('edit');
                        Route::put('/', [PageController::class, 'update'])->name('update');
                        Route::delete('/', [PageController::class, 'destroy'])->name('destroy');
                    });
                });
            
                Route::prefix('news')->name('news.')->group(function () {
                    Route::get('/', [NewsController::class, 'index'])->name('index');
                    Route::get('/create', [NewsController::class, 'create'])->name('create');
                    Route::post('/', [NewsController::class, 'store'])->name('store');
                    Route::prefix('/{news}')->group(function () {
                        Route::get('/edit', [NewsController::class, 'edit'])->name('edit');
                        Route::put('/', [NewsController::class, 'update'])->name('update');
                        Route::delete('/', [NewsController::class, 'destroy'])->name('destroy');
                    });
                });
            
                Route::prefix('banners')->name('banners.')->group(function () {
                    Route::get('/', [BannerController::class, 'index'])->name('index');
                    Route::get('/create', [BannerController::class, 'create'])->name('create');
                    Route::post('/', [BannerController::class, 'store'])->name('store');
                    Route::prefix('/{banners}')->group(function () {
                        Route::get('/edit', [BannerController::class, 'edit'])->name('edit');
                        Route::put('/', [BannerController::class, 'update'])->name('update');
                        Route::delete('/', [BannerController::class, 'destroy'])->name('destroy');
                    });
                });
            
                Route::prefix('menus')->name('menus.')->group(function () {
                    Route::get('/', [MenuController::class, 'index'])->name('index');
                    Route::get('/create', [MenuController::class, 'create'])->name('create');
                    Route::post('/', [MenuController::class, 'store'])->name('store');
                    Route::prefix('/{menu}')->group(function () {
                        Route::get('/', [MenuController::class, 'show'])->name('show');
                        Route::get('/edit', [MenuController::class, 'edit'])->name('edit');
                        Route::put('/', [MenuController::class, 'update'])->name('update');
                        Route::delete('/', [MenuController::class, 'destroy'])->name('destroy');
                        Route::put('/update-order', [MenuController::class, 'updateOrder'])->name('update-order');
                    });
                });
            
                Route::prefix('media')->name('media.')->group(function () {
                    Route::get('/', [MediaController::class, 'index'])->name('index');
                    Route::post('/', [MediaController::class, 'store'])->name('store');
                    Route::put('/{media}', [MediaController::class, 'update'])->name('update');
                    Route::delete('/{media}', [MediaController::class, 'destroy'])->name('destroy');
                    Route::post('/{media}/restore', [MediaController::class, 'restore'])->name('restore');
                    Route::delete('/{media}/force-delete', [MediaController::class, 'forceDelete'])->name('forceDelete');
                });
            
                Route::prefix('menus')->name('menu-items.')->group(function () {
                    Route::prefix('/{menu}')->group(function () {
                        Route::get('/items', [MenuItemController::class, 'index'])->name('index');
                        Route::post('/items', [MenuItemController::class, 'store'])->name('store');
                        Route::post('/add-pages', [MenuItemController::class, 'addPage'])->name('add-pages');
                        Route::post('/add-categories', [MenuItemController::class, 'addCategory'])->name('add-categories');
                        Route::post('/items/batch', [MenuItemController::class, 'storeBatch']);
                        Route::patch('/items/batch', [MenuItemController::class, 'updateBatch']);
                    });
                });
            
                Route::prefix('menu-items')->name('menu-items.')->group(function () {
                    Route::match(['put', 'patch'], '/{menuItem}', [MenuItemController::class, 'update'])->name('update');
                    Route::delete('/{menuItem}', [MenuItemController::class, 'destroy'])->name('destroy');
                });
                
                Route::resource('testimonials', \App\Http\Controllers\Web\TestimonialController::class);
                Route::patch('/testimonials/{testimonial}/toggle', [TestimonialController::class, 'toggle'])->name('testimonials.toggle');
            
                Route::prefix('analytics')->name('analytics.')->group(function () {
                    Route::get('/', [AnalyticsController::class, 'index'])->name('index');
                    Route::put('/seo-report', [AnalyticsController::class, 'seoReport'])->name('seo-report');
                });
                
                Route::prefix('settings')->name('settings.')->group(function () {
                    Route::get('/', [SiteSettingsController::class, 'edit'])->name('edit');
                    Route::post('/', [SiteSettingsController::class, 'update'])->name('update');
                });
            
                Route::prefix('themes')->name('themes.')->group(function () {
                    Route::get('/', [ThemesController::class, 'index'])->name('index');
                    Route::get('/create', [ThemesController::class, 'create'])->name('create');
                    Route::post('/', [ThemesController::class, 'store'])->name('store');
                    Route::get('/{theme}/edit', [ThemesController::class, 'edit'])->name('edit');
                    Route::put('/{theme}', [ThemesController::class, 'update'])->name('update');
                    Route::post('/{theme}/activate', [ThemesController::class, 'activate'])->name('activate');
                });
            
                Route::prefix('footers')->name('footers.')->group(function () {
                    Route::get('/manage', [FooterController::class, 'index'])->name('manage');
                    Route::post('/{footer}', [FooterController::class, 'update'])->name('update');
                    
                    Route::post('/{footer}/activate', [FooterController::class, 'activate'])->name('activate');
                    Route::post('/{footer}/upload-logo', [FooterController::class, 'uploadLogo'])->name('upload-logo');
                    Route::post('/{footer}/upload-brand', [FooterController::class, 'uploadBrand'])->name('upload-brand');
                    Route::get('/{menu}/items', [FooterController::class, 'getMenuItems'])->name('items');
                    Route::post('/reorder', [FooterController::class, 'reorderMenuItems'])->name('reorder');
                    Route::put('/{menuItem}/toggle', [FooterController::class, 'toggleMenuItem'])->name('toggle');
                });
            
                Route::prefix('tenants')->name('tenants.')->group(function () {
                    Route::get('/', [CentralTenantController::class, 'index'])->name('index');
                    Route::get('/create', [CentralTenantController::class, 'create'])->name('create');
                    Route::post('/', [CentralTenantController::class, 'store'])->name('store');
                    Route::prefix('{tenant}')->group(function () {
                        Route::get('/', [CentralTenantController::class, 'show'])->name('show');
                        Route::get('/edit', [CentralTenantController::class, 'edit'])->name('edit');
                        Route::put('/', [CentralTenantController::class, 'update'])->name('update');
                        Route::delete('/', [CentralTenantController::class, 'destroy'])->name('destroy');
                        Route::get('/reset-admin', [TenantController::class, 'resetAdminCredentials'])->name('reset-admin');
                        Route::post('/reset-admin', [TenantController::class, 'updateAdminCredentials'])->name('update-admin');
                    });
                });

        

            // Rutas para gestión de suscripciones de tenants
            Route::get('/tenants/{tenant}/subscription', [TenantController::class, 'showSubscription'])->name('tenants.subscription');
            Route::post('/tenants/{tenant}/subscription', [TenantController::class, 'updateSubscription'])->name('tenants.subscription.update');
            Route::get('/tenants/{tenant}/check-payment', [TenantController::class, 'checkPaymentStatus'])->name('tenants.check-payment');
            // Gestión de planes de suscripción
            Route::resource('subscription-plans', SubscriptionPlanController::class);

            // Gestión de pagos
            Route::resource('payments', PaymentController::class)->except(['edit', 'update', 'destroy']);
            Route::post('/payments/{payment}/update-status', [PaymentController::class, 'updateStatus'])->name('payments.update-status');
            Route::post('/tenants/{tenant}/toggle-active', [PaymentController::class, 'toggleActive'])->name('tenants.toggle-active');

            // Rutas para planes de suscripción
            // Route::prefix('subscription-plans')->name('subscription-plans.')->group(function () {
            //     Route::get('/', [SubscriptionPlanController::class, 'index'])->name('index');
            //     Route::get('/create', [SubscriptionPlanController::class, 'create'])->name('create');
            //     Route::post('/', [SubscriptionPlanController::class, 'store'])->name('store');
            //     Route::get('/{plan}/edit', [SubscriptionPlanController::class, 'edit'])->name('edit');
            //     Route::put('/{plan}', [SubscriptionPlanController::class, 'update'])->name('update');
            //     Route::delete('/{plan}', [SubscriptionPlanController::class, 'destroy'])->name('destroy');
            // });
            });
        });

    });

        Route::get('/customer/register', [TenantController::class, 'showRegistrationForm'])->name('tenant.register');
Route::post('/customer/register', [TenantController::class, 'register']);
Route::get('/customer/registered/{domain}', [TenantController::class, 'registered'])->name('tenant.registered');

        require __DIR__ . '/settings.php';
        require __DIR__ . '/auth.php';
    });
}


Route::get('/run-subscription-check', function () {
    // Verificar si la solicitud viene de un usuario autenticado o de un cron job con token
    if (Auth::check() || request()->header('X-Cron-Token') === config('app.cron_token')) {
        Artisan::call('subscriptions:check-expirations');
        return response()->json([
            'success' => true,
            'message' => 'Verificación de suscripciones completada',
            'output' => Artisan::output()
        ]);
    }

    return response()->json(['error' => 'No autorizado'], 403);
});