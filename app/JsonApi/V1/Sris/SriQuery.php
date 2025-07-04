<?php

namespace App\JsonApi\V1\Sris;

use LaravelJsonApi\Laravel\Http\Requests\ResourceQuery;

class SriQuery extends ResourceQuery
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'filter.identification' => ['required', 'string', 'min:10', 'max:13'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'filter.identification.required' => 'The identification filter is required.',
            'filter.identification.string' => 'The identification must be a string.',
            'filter.identification.min' => 'The identification must be at least 10 characters.',
            'filter.identification.max' => 'The identification may not be greater than 13 characters.',
        ];
    }
}