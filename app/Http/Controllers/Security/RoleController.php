<?php

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Security\StoreRoleRequest;
use App\Http\Requests\Security\UpdateRoleRequest;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RoleController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Muestra todos los roles con permisos agrupados
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);
        
        $filters = [
            'search' => $request->input('search', ''),
            'guard' => $request->input('guard', 'web'),
        ];

        // Obtener estadísticas de usuarios por user_type
        $userTypeStats = DB::table('users')
            ->select('user_type', DB::raw('COUNT(*) as total_users'))
            ->whereNotNull('user_type')
            ->groupBy('user_type')
            ->pluck('total_users', 'user_type')
            ->toArray();

        $roles = Role::with('permissions')
            ->when($filters['search'], fn($query, $search) => 
                $query->where('name', 'like', "%{$search}%")
            )
            ->when($filters['guard'], fn($query, $guard) => 
                $query->where('guard_name', $guard)
            )
            ->orderBy('name')
            ->get()
            ->map(function ($role) use ($userTypeStats) {
                // Mapear nombres de roles a user_type
                $userTypeMapping = [
                    'Super admin' => 'admin',
                    'Admin' => 'admin',
                    'Provider' => 'provider', 
                    'Customer' => 'customer',
                    // Agrega más mapeos según tus roles
                ];

                // Buscar el user_type correspondiente al rol
                $userType = $userTypeMapping[strtolower($role->name)] ?? 
                           $userTypeMapping[$role->name] ?? 
                           strtolower($role->name);

                // Obtener el conteo de usuarios para este user_type
                $usersCount = $userTypeStats[$userType] ?? 0;

                // Si no hay mapeo directo, intentar contar por el sistema tradicional de Spatie
                if ($usersCount === 0) {
                    $usersCount = DB::table('model_has_roles')
                        ->where('role_id', $role->id)
                        ->where('model_type', User::class)
                        ->count();
                }

                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'users_count' => $usersCount,
                    'permissions_count' => $role->permissions->count(),
                    'permissions' => $role->permissions->pluck('name')->toArray(),
                    'created_at' => $role->created_at->toDateTimeString(),
                    'updated_at' => $role->updated_at->toDateTimeString()
                ];
            });

        $permissionsByGroup = $this->getGroupedPermissions();

        return Inertia::render('app/roles/index', [
            'roles' => $roles,
            'permissionsByGroup' => $permissionsByGroup,
            'filters' => $filters,
            'guards' => array_keys(config('auth.guards', [])),
            'userTypeStats' => $userTypeStats // Opcional: enviar las estadísticas para debug
        ]);
    }
    
    public function create()
    {
        $this->authorize('create', Role::class);

        $permissionsByGroup = $this->getGroupedPermissions();

        return Inertia::render('app/roles/create', [
            'permissionsByGroup' => $permissionsByGroup,
            'guards' => array_keys(config('auth.guards')),
        ]);
    }

    /**
     * Almacena un nuevo rol
     */
    public function store(StoreRoleRequest $request)
    {
        $this->authorize('create', Role::class);

        DB::transaction(function () use ($request) {
            $role = Role::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name ?? 'web',
                'description' => $request->description,
            ]);

            if ($request->permissions) {
                $role->syncPermissions($request->permissions);
            }

            if ($request->is_admin_role) {
                $role->givePermissionTo(Permission::all());
            }
        });

        return redirect()->route('admin.roles.index')
            ->with('success', 'Rol creado correctamente');
    }

    /**
     * Muestra el formulario para editar un rol
     */
    public function edit(Role $role)
    {
        $this->authorize('update', $role);

        $permissionsByGroup = $this->getGroupedPermissions();
        $rolePermissionIds = $role->permissions->pluck('id')->toArray();

        return response()->json([
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'description' => $role->description,
                'created_at' => $role->created_at->toDateTimeString(),
                'updated_at' => $role->updated_at->toDateTimeString(),
                'permissions' => $rolePermissionIds,
            ],
            'permissions' => $permissionsByGroup,
            'guards' => array_keys(config('auth.guards', []))
        ]);
    }

    /**
     * Actualiza un rol existente
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);

        // Prevenir modificación del rol superadmin
        if ($role->name === 'Super admin') {
            return redirect()->route('admin.roles.index')
                ->with('error', 'No puedes modificar el rol Super admin');
        }

        DB::transaction(function () use ($request, $role) {
            $role->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name ?? 'web',
                'description' => $request->description,
            ]);

            // Sincronizar permisos
            $permissions = $request->permissions ?? [];
            $role->syncPermissions($permissions);
        });

        return redirect()->route('admin.roles.index')
            ->with('success', 'Rol actualizado correctamente');
    }

    /**
     * Elimina un rol
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);

        if ($role->name === 'Super admin') {
            return redirect()->route('admin.roles.index')
                ->with('error', 'No puedes eliminar el rol Super admin');
        }

        // Verificar si el rol está en uso
        if ($role->users_count > 0) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'No se puede eliminar el rol porque está asignado a usuarios');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Rol eliminado correctamente');
    }

    /**
     * Agrupa los permisos por módulo (similar a Filament Shield)
     */
    protected function getGroupedPermissions(): array
    {
        return Permission::orderBy('name')
            ->get()
            ->groupBy(function ($permission) {
                // Extraer el nombre del módulo del nombre del permiso
                // Ejemplo: "users.view" -> "users"
                return Str::before($permission->name, '.');
            })
            ->map(function ($permissions, $group) {
                return [
                    'group' => $group,
                    'permissions' => $permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'description' => $this->getPermissionDescription($permission->name),
                        ];
                    })
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Obtiene una descripción legible para el permiso
     */
    protected function getPermissionDescription(string $permission): string
    {
        $action = Str::after($permission, '.');
        $resource = Str::before($permission, '.');

        $actions = [
            'view' => 'Ver',
            'view_any' => 'Ver todos',
            'create' => 'Crear',
            'update' => 'Actualizar',
            'delete' => 'Eliminar',
            'delete_any' => 'Eliminar cualquier',
            'restore' => 'Restaurar',
            'restore_any' => 'Restaurar cualquier',
            'replicate' => 'Replicar',
            'reorder' => 'Reordenar',
            'force_delete' => 'Forzar eliminación',
            'force_delete_any' => 'Forzar eliminación de cualquier',
        ];

        $resources = [
            'users' => 'usuarios',
            'roles' => 'roles',
            'permissions' => 'permisos',
            // Agrega más recursos según sea necesario
        ];

        $actionText = $actions[$action] ?? $action;
        $resourceText = $resources[$resource] ?? $resource;

        return "{$actionText} {$resourceText}";
    }
}