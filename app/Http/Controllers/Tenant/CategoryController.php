<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Muestra la lista de categorías
     */
    public function index(Request $request)
    {
        $query = Category::query();
        
        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        // Ordenamiento
        $sortField = $request->input('sort_field', 'name');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortField, $sortOrder);
        
        // Paginación
        $perPage = $request->input('per_page', 10);
        $categories = $query->withCount('products')->paginate($perPage)->withQueryString();
        
        return Inertia::render('customer/categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'is_active' => $request->boolean('is_active', null),
                'sort_field' => $sortField,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Muestra el formulario para crear una categoría
     */
    public function create()
    {
        return Inertia::render('customer/categories/create');
    }

    /**
     * Almacena una nueva categoría
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:255',
        ]);
        
        try {
            DB::beginTransaction();
            
            $category = Category::create($validated);
            
            DB::commit();
            
            return redirect()->route('tenant.categories.index')
                ->with('success', 'Categoría creada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Error al crear la categoría: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Muestra los detalles de una categoría
     */
    public function show(Category $category)
    {
        $category->loadCount('products');
        
        return Inertia::render('customer/categories/show', [
            'category' => $category,
        ]);
    }

    /**
     * Muestra el formulario para editar una categoría
     */
    public function edit(Category $category)
    {
        return Inertia::render('customer/categories/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Actualiza una categoría
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);
        
        try {
            DB::beginTransaction();
            
            $category->update($validated);
            
            DB::commit();
            
            return redirect()->route('tenant.categories.index')
                ->with('success', 'Categoría actualizada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Error al actualizar la categoría: ' . $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Elimina una categoría
     */
    public function destroy(Category $category)
    {
        try {
            DB::beginTransaction();
            
            // Verificar si tiene productos asociados
            $productsCount = $category->products()->count();
            if ($productsCount > 0) {
                return back()->withErrors([
                    'error' => 'No se puede eliminar la categoría porque tiene productos asociados.',
                ]);
            }
            
            $category->delete();
            
            DB::commit();
            
            return redirect()->route('tenant.categories.index')
                ->with('success', 'Categoría eliminada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withErrors([
                'error' => 'Error al eliminar la categoría: ' . $e->getMessage(),
            ]);
        }
    }
} 