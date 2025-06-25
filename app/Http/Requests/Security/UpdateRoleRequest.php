<?php

namespace App\Http\Requests\Security;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check() && auth()->user()->hasRole('Super admin');
    }

    public function rules()
    {
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->where(function ($query) {
                    return $query->where('guard_name', $this->guard_name ?? 'web');
                })->ignore($role->id),
            ],
            'guard_name' => 'nullable|string|in:'.implode(',', array_keys(config('auth.guards'))),
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ];
    }

    public function messages()
    {
        return [
            'permissions.*.exists' => 'El permiso :input no existe en el sistema',
        ];
    }

    protected function prepareForValidation()
    {
        // Asegurar que permissions sea un array incluso si viene vacío
        if (!$this->has('permissions')) {
            $this->merge(['permissions' => []]);
        }
    }
}