<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Plan;
use App\Models\TenantDetail;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Show the tenant registration form.
     */
    public function showRegistrationForm(): Response
    {
        $plans = Plan::all();
        return Inertia::render('customer/tenant/register', [
            'plans' => $plans,
        ]);
    }

    /**
     * Handle the tenant registration request.
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255|unique:domains,domain',
            'company_name' => 'required|string|max:255',
            'ruc' => 'required|string|max:13|unique:tenant_details,ruc',
            'email' => 'required|email|unique:tenant_details,email',
            'plan_id' => 'required|exists:plans,id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'legal_representative' => 'nullable|string|max:255',
        ]);

        // Crear el tenant
        $tenant = Tenant::create();

        // Crear el dominio
        $domain = $tenant->domains()->create(['domain' => $validated['domain']]);

        // Crear los detalles del tenant
        $tenant->details()->create([
            'domain_id' => $domain->id,
            'company_name' => $validated['company_name'] ?? $validated['domain'],
            'ruc' => $validated['ruc'],
            'email' => $validated['email'],
            'plan_id' => $validated['plan_id'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'legal_representative' => $validated['legal_representative'],
        ]);

        // Redirigir a la página de registro completado con el email en la sesión
        return redirect()->route('tenant.registered', [
            'domain' => $validated['domain'],
        ])->with('email', $validated['email']);
    }

    /**
     * Show the tenant registered confirmation page.
     */
    public function registered(string $domain): Response
    {
        // Redirigir automáticamente después de 3 segundos
        $redirectUrl = "https://{$domain}.anahisoft.test/onboarding";
        
        return Inertia::render('customer/tenant/registered', [
            'domain' => $domain,
            'redirectUrl' => $redirectUrl,
            'email' => session('email'),
        ]);
    }
}