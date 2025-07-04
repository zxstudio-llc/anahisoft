<?php

namespace App\JsonApi\V1\Sris;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

class SriResource extends JsonApiResource
{
    /**
     * Get the resource's attributes.
     */
    public function attributes(Request $request): iterable
    {
        return [
            'identification' => $this->identification,
            'contribuyente' => $this->contribuyente,
            'deuda' => $this->deuda,
            'impugnacion' => $this->impugnacion,
            'remision' => $this->remision,
            'infoRuc' => $this->info_ruc,
        ];
    }

    /**
     * Get the resource's relationships.
     */
    public function relationships(Request $request): iterable
    {
        return [
            // Aquí puedes agregar relaciones si las necesitas
        ];
    }

    /**
     * Get the resource's links.
     */
    // public function links(Request $request): iterable
    // {
    //     return [
    //         'self' => route('api:v1:sri-contribuyentes.show', $this->identification),
    //     ];
    // }

    /**
     * Get the resource's meta.
     */
    public function meta(Request $request): iterable
    {
        return [
            'retrieved_at' => now()->toISOString(),
            'source' => 'SRI Ecuador',
        ];
    }
}