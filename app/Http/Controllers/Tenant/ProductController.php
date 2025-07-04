<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Muestra la lista de productos
     */
    public function index()
    {
        // Aquí iría la lógica para obtener los productos
        $products = [
            [
                'id' => 1,
                'name' => 'Producto Ejemplo 1',
                'price' => 19.99,
                'stock' => 100,
                'category' => 'Categoría 1',
                'created_at' => now()->subDays(10)->format('Y-m-d'),
            ],
            [
                'id' => 2,
                'name' => 'Producto Ejemplo 2',
                'price' => 29.99,
                'stock' => 50,
                'category' => 'Categoría 2',
                'created_at' => now()->subDays(5)->format('Y-m-d'),
            ],
        ];

        return Inertia::render('customer/products/index', [
            'products' => $products
        ]);
    }

    /**
     * Muestra el formulario para crear un producto
     */
    public function create()
    {
        return Inertia::render('customer/products/create');
    }

    /**
     * Almacena un nuevo producto
     */
    public function store(Request $request)
    {
        // Validación y almacenamiento
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        // Aquí iría la lógica para guardar el producto

        return redirect()->route('tenant.products.index')
            ->with('success', 'Producto creado correctamente');
    }

    /**
     * Muestra los detalles de un producto
     */
    public function show($id)
    {
        // Aquí iría la lógica para obtener el producto
        $product = [
            'id' => $id,
            'name' => 'Producto Ejemplo ' . $id,
            'price' => 19.99,
            'stock' => 100,
            'category' => 'Categoría 1',
            'description' => 'Descripción detallada del producto ejemplo ' . $id,
            'created_at' => now()->subDays(10)->format('Y-m-d'),
        ];

        return Inertia::render('customer/products/show', [
            'product' => $product
        ]);
    }

    /**
     * Muestra el formulario para editar un producto
     */
    public function edit($id)
    {
        // Aquí iría la lógica para obtener el producto
        $product = [
            'id' => $id,
            'name' => 'Producto Ejemplo ' . $id,
            'price' => 19.99,
            'stock' => 100,
            'category' => 'Categoría 1',
            'description' => 'Descripción detallada del producto ejemplo ' . $id,
        ];

        return Inertia::render('customer/products/edit', [
            'product' => $product
        ]);
    }

    /**
     * Actualiza un producto
     */
    public function update(Request $request, $id)
    {
        // Validación y actualización
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
        ]);

        // Aquí iría la lógica para actualizar el producto

        return redirect()->route('tenant.products.index')
            ->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Elimina un producto
     */
    public function destroy($id)
    {
        // Aquí iría la lógica para eliminar el producto

        return redirect()->route('tenant.products.index')
            ->with('success', 'Producto eliminado correctamente');
    }
} 