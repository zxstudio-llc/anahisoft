<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        \Log::info('Usuario intentando acceder a users:', [
            'id' => $user->id,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name')->toArray(),
            'user_type' => $user->user_type,
            'isAdmin' => $user->isAdmin(),
            'isSuperAdmin' => $user->isSuperAdmin(),
        ]);
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'image' => $user->image,
                    'status' => $user->status,
                    'is_verified' => $user->is_verified,
                    'is_suspended' => $user->is_suspended,
                    'gender' => $user->gender,
                    'date_of_birth' => $user->date_of_birth,
                    'dni' => $user->dni,
                    'company_name' => $user->company_name,
                    'company_address' => $user->company_address,
                    'user_type' => $user->user_type,
                    'roles' => $user->roles,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i:s'),
                ];
            });

        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name
            ];
        });

        return Inertia::render('app/users/index', [
            'users' => $users,
            'roles' => $roles,
            'currentUserId' => auth()->id()
        ]);
    }

    public function create()
    {
        $roles = Role::where('name', '!=', 'Super admin')->get();
        $existingProviders = User::whereHas('roles', fn($q) => $q->where('name', 'Provider'))
                            ->where('is_primary', true)
                            ->get(['id', 'company_name', 'dni']);
        
        return Inertia::render('app/users/create', [
            'roles' => $roles,
            'existingProviders' => $existingProviders
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'subscribed_to_news_letter' => 'nullable|boolean',
            'dni' => 'required_if:is_new_provider,true|string|max:20',
            'company_name' => 'required_if:is_new_provider,true|string|max:255',
            'company_address' => 'required_if:is_new_provider,true|string|max:255',
            'role_id' => 'required|exists:roles,id',
            'provider_id' => 'nullable|exists:users,id',
            'is_new_provider' => 'boolean'
        ]);

        $role = Role::find($validated['role_id']);
        $userType = $this->determineUserType($role->name);

        // Si es proveedor, manejar la lógica de proveedor
        if ($role->name === 'Provider') {
            if ($request->is_new_provider) {
                // Crear nuevo proveedor primario
                $validated['is_primary'] = true;
            } else {
                // Usar proveedor existente
                $provider = User::find($validated['provider_id']);
                $validated['dni'] = $provider->dni;
                $validated['company_name'] = $provider->company_name;
                $validated['company_address'] = $provider->company_address;
                $validated['is_primary'] = false;
            }
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('users', 'public');
        }

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'image' => $imagePath,
            'status' => $validated['status'] ?? true,
            'address' => $validated['address'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'subscribed_to_news_letter' => $validated['subscribed_to_news_letter'] ?? false,
            'dni' => $validated['dni'] ?? null,
            'company_name' => $validated['company_name'] ?? null,
            'company_address' => $validated['company_address'] ?? null,
            'user_type' => $userType,
            'is_verified' => false,
            'is_suspended' => false,
            'is_primary' => $validated['is_primary'] ?? false,
        ]);

        $user->syncRoles($role);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado correctamente');
    }

    protected function determineUserType(string $roleName): string
    {
        if (str_contains($roleName, 'Admin')) {
            return 'admin';
        } elseif (str_contains($roleName, 'Provider') || str_contains($roleName, 'Proveedor')) {
            return 'provider';
        } elseif (str_contains($roleName, 'Customer') || str_contains($roleName, 'Cliente')) {
            return 'customer';
        }
        return 'user'; // Valor por defecto
    }

    public function edit(User $user)
    {
        // Cargar la relación roles explícitamente
        $user->load('roles');
        
        $roles = Role::all();

        $userTypes = User::select('user_type')
            ->distinct()
            ->whereNotNull('user_type')
            ->pluck('user_type')
            ->toArray();
        
        return Inertia::render('app/users/edit', [
            'user' => [
                // Datos básicos del usuario
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'phone' => $user->phone,
                'status' => $user->status,
                'address' => $user->address,
                'gender' => $user->gender,
                'date_of_birth' => $user->date_of_birth,
                'dni' => $user->dni,
                'company_name' => $user->company_name,
                'company_address' => $user->company_address,
                'is_verified' => $user->is_verified,
                'is_suspended' => $user->is_suspended,
                'is_primary' => $user->is_primary,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'email_verified_at' => $user->email_verified_at,
                
                // Datos adicionales
                'role_id' => $user->roles->first()?->id,
                'image_url' => $user->image ? Storage::url($user->image) : null,
                
                // Incluir roles en el array para el frontend
                'roles' => $user->roles->map(function($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name
                    ];
                })
            ],
            'roles' => $roles,
            'userTypes' => $userTypes
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validUserTypes = User::select('user_type')
            ->distinct()
            ->whereNotNull('user_type')
            ->pluck('user_type')
            ->toArray();
            
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
            'is_suspended' => 'nullable|boolean',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'subscribed_to_news_letter' => 'nullable|boolean',
            'dni' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:255',
            'user_type' => 'required|in:' . implode(',', $validUserTypes),
            'role_id' => 'required|exists:roles,id'
        ]);

        $data = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'] ?? $user->status,
            'is_verified' => $validated['is_verified'] ?? $user->is_verified,
            'is_suspended' => $validated['is_suspended'] ?? $user->is_suspended,
            'address' => $validated['address'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'],
            'subscribed_to_news_letter' => $validated['subscribed_to_news_letter'] ?? $user->subscribed_to_news_letter,
            'dni' => $validated['dni'],
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'user_type' => $validated['user_type'],
        ];

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $data['image'] = $request->file('image')->store('users', 'public');
        }

        if ($validated['password']) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        // Actualizar rol (excepto para Super admin)
        if (!$user->hasRole('Super admin')) {
            // CORRECCIÓN: Obtener el nombre del rol por su ID
            $role = Role::find($validated['role_id']);
            if ($role) {
                $user->syncRoles([$role->name]); // Usar el nombre del rol, no el ID
            }
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado correctamente');
    }

    public function destroy(User $user)
    {
        // No permitir eliminar super admins o al usuario actual
        if ($user->hasRole('Super admin') || $user->id === auth()->id()) {
            abort(403, 'No se puede eliminar este usuario');
        }

        // Eliminar imagen si existe
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado correctamente');
    }
}