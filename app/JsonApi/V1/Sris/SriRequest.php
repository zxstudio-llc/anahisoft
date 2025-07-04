<?php

namespace App\JsonApi\V1\Sris;

use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class SriRequest extends ResourceRequest
{
    /**
     * Get the validation rules for the resource.
     */
    public function rules(): array
    {
        return [
            'identification' => ['required', 'string', 'min:10', 'max:13'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'identification.required' => 'La identificación es requerida.',
            'identification.string' => 'La identificación debe ser una cadena de texto.',
            'identification.min' => 'La identificación debe tener al menos 10 caracteres.',
            'identification.max' => 'La identificación no puede tener más de 13 caracteres.',
        ];
    }
}