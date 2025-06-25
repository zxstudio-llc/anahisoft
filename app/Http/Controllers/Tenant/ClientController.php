<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Muestra la lista de clientes
     */
    public function index()
    {
        // Aquí iría la lógica para obtener los clientes
        $clients = [
            [
                'id' => 1,
                'name' => 'Cliente Ejemplo 1',
                'email' => 'cliente1@ejemplo.com',
                'phone' => '123456789',
                'created_at' => now()->subDays(5)->format('Y-m-d'),
            ],
            [
                'id' => 2,
                'name' => 'Cliente Ejemplo 2',
                'email' => 'cliente2@ejemplo.com',
                'phone' => '987654321',
                'created_at' => now()->subDays(2)->format('Y-m-d'),
            ],
        ];

        return Inertia::render('Tenant/Clients/Index', [
            'clients' => $clients
        ]);
    }

    /**
     * Muestra el formulario para crear un cliente
     */
    public function create()
    {
        return Inertia::render('Tenant/Clients/Create');
    }

    /**
     * Almacena un nuevo cliente
     */
    public function store(Request $request)
    {
        // Validación y almacenamiento
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Aquí iría la lógica para guardar el cliente

        return redirect()->route('tenant.clients.index')
            ->with('success', 'Cliente creado correctamente');
    }

    /**
     * Muestra los detalles de un cliente
     */
    public function show($id)
    {
        // Aquí iría la lógica para obtener el cliente
        $client = [
            'id' => $id,
            'name' => 'Cliente Ejemplo ' . $id,
            'email' => 'cliente' . $id . '@ejemplo.com',
            'phone' => '123456789',
            'address' => 'Dirección de ejemplo',
            'city' => 'Ciudad',
            'created_at' => now()->subDays(5)->format('Y-m-d'),
        ];

        return Inertia::render('Tenant/Clients/Show', [
            'client' => $client
        ]);
    }

    /**
     * Muestra el formulario para editar un cliente
     */
    public function edit($id)
    {
        // Aquí iría la lógica para obtener el cliente
        $client = [
            'id' => $id,
            'name' => 'Cliente Ejemplo ' . $id,
            'email' => 'cliente' . $id . '@ejemplo.com',
            'phone' => '123456789',
            'address' => 'Dirección de ejemplo',
            'city' => 'Ciudad',
        ];

        return Inertia::render('Tenant/Clients/Edit', [
            'client' => $client
        ]);
    }

    /**
     * Actualiza un cliente
     */
    public function update(Request $request, $id)
    {
        // Validación y actualización
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
        ]);

        // Aquí iría la lógica para actualizar el cliente

        return redirect()->route('tenant.clients.index')
            ->with('success', 'Cliente actualizado correctamente');
    }

    /**
     * Elimina un cliente
     */
    public function destroy($id)
    {
        // Aquí iría la lógica para eliminar el cliente

        return redirect()->route('tenant.clients.index')
            ->with('success', 'Cliente eliminado correctamente');
    }
} 