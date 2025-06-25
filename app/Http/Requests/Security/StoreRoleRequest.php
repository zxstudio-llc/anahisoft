<?php

namespace App\Http\Requests\Security;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check() && auth()->user()->hasRole('Super admin');
    }

    public function rules()
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->where(function ($query) {
                    return $query->where('guard_name', $this->guard_name ?? 'web');
                }),
            ],
            'guard_name' => 'nullable|string|in:'.implode(',', array_keys(config('auth.guards'))),
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
            'is_admin_role' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'name.unique' => 'Ya existe un rol con este nombre para el guard seleccionado.',
            'guard_name.in' => 'El guard seleccionado no es válido.',
        ];
    }
}