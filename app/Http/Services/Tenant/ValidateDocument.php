<?php

namespace App\Http\Services\Tenant;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ValidateDocument
{
    private string $token;
    private string $base_url;

    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->base_url = env('BASE_URL_RUC');
    }

    /**
     * Valida un número de DNI peruano
     * 
     * @param string $dni Número de DNI a validar
     * @return array Datos de la persona o mensaje de error
     */
    public function validate_dni(string $dni): array
    {
        // Validación básica
        if (strlen($dni) !== 8 || !is_numeric($dni)) {
            return [
                'success' => false,
                'message' => 'El DNI debe tener 8 dígitos numéricos'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token
            ])->get("{$this->base_url}/dni/{$dni}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => 'No se pudo validar el DNI',
                'error' => $response->json()
            ];
        } catch (\Exception $e) {
            Log::error('Error validando DNI: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error en la conexión con el servicio de validación'
            ];
        }
    }

    /**
     * Valida un número de RUC peruano
     * 
     * @param string $ruc Número de RUC a validar
     * @return array Datos de la empresa o mensaje de error
     */
    public function validate_ruc(string $ruc): array
    {
        // Validación básica
        if (strlen($ruc) !== 11 || !is_numeric($ruc)) {
            return [
                'success' => false,
                'message' => 'El RUC debe tener 11 dígitos numéricos'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token
            ])->get("{$this->base_url}/ruc/{$ruc}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => 'No se pudo validar el RUC',
                'error' => $response->json()
            ];
        } catch (\Exception $e) {
            Log::error('Error validando RUC: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error en la conexión con el servicio de validación'
            ];
        }
    }
}
