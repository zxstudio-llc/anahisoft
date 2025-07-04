<?php

namespace App\Http\Controllers\Api\V1\Sri;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Services\SriService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\Sri;
use App\Exceptions\SriNotFoundException;
use App\Exceptions\SriServiceException;

class SriController extends JsonApiController
{
    protected SriService $sriService;

    public function __construct(SriService $sriService)
    {
        $this->sriService = $sriService;
    }

    /**
     * POST /api/v1/sris/search
     * Consulta información de un contribuyente en el SRI (solo RUC ahora)
     */
    public function search(Request $request)
    {
        try {
            $validatedData = $this->validateRequest($request);
            $identification = $validatedData['data']['attributes']['identification'];

            // Validamos que sea un RUC válido (13 dígitos)
            if (strlen($identification) !== 13) {
                throw ValidationException::withMessages([
                    'data.attributes.identification' => ['Solo se permiten consultas de RUC (13 dígitos)']
                ]);
            }

            $cacheKey = 'sri_data_'.md5($identification);
            $contribuyente = Cache::remember($cacheKey, now()->addHours(6), function() use ($identification) {
                $sriData = $this->sriService->getRucData($identification);
                return Sri::createFromApiData($sriData, $identification);
            });

            return $this->successResponse($contribuyente, $cacheKey);

        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (SriNotFoundException $e) {
            return $this->notFoundResponse($identification ?? '');
        } catch (SriServiceException $e) {
            return $this->serviceErrorResponse($e);
        } catch (\Exception $e) {
            return $this->serverErrorResponse($e, $request);
        }
    }

    /**
     * Valida la estructura y formato del request (solo RUC ahora)
     */
    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'data' => 'required|array',
            'data.attributes' => 'required|array',
            'data.attributes.identification' => [
                'required',
                'string',
                'size:13',
                'regex:/^[0-9]+$/',
                function ($attribute, $value, $fail) {
                    if (!$this->validateRucBasicFormat($value)) {
                        $fail('El RUC no tiene un formato válido.');
                    }
                }
            ],
        ], [
            'data.attributes.identification.required' => 'El RUC es obligatorio',
            'data.attributes.identification.size' => 'El RUC debe tener exactamente 13 dígitos',
            'data.attributes.identification.regex' => 'El RUC solo debe contener números',
        ]);
    }

    /**
     * Valida el formato de cédula/RUC ecuatoriano
     */
    private function validateIdentification(string $identification): bool
{
    $length = strlen($identification);
    
    // Validación básica de longitud
    if ($length < 10 || $length > 13) {
        return false;
    }
    
    // Solo dígitos
    if (!ctype_digit($identification)) {
        return false;
    }
    
    // Validación específica por longitud
    if ($length === 10) {
        return $this->validateCedula($identification);
    }
    
    if ($length === 13) {
        // Solo verificar formato básico, no la suma de verificación
        return $this->validateRucBasicFormat($identification);
    }
    
    return true;
}

private function validateRucBasicFormat(string $ruc): bool
{
    // Los primeros dos dígitos deben ser válidos para Ecuador (01-24)
    $provinceCode = substr($ruc, 0, 2);
    if ($provinceCode < '01' || $provinceCode > '24') {
        return false;
    }

    // El tercer dígito debe ser entre 0 y 6 o 9
    $thirdDigit = $ruc[2];
    return in_array($thirdDigit, ['0', '1', '2', '3', '4', '5', '6', '9']);
}

    /**
     * Algoritmo de validación para cédulas ecuatorianas
     */
    private function validateCedula(string $cedula): bool
    {
        if (!ctype_digit($cedula)) {
            return false;
        }

        $total = 0;
        $coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $verifier = (int)$cedula[9];

        for ($i = 0; $i < 9; $i++) {
            $value = (int)$cedula[$i] * $coefficients[$i];
            $total += ($value >= 10) ? $value - 9 : $value;
        }

        $calculatedVerifier = ($total % 10 !== 0) ? 10 - ($total % 10) : 0;

        return $calculatedVerifier === $verifier;
    }

    /**
     * Algoritmo de validación para RUCs ecuatorianos
     */
    /**
 * Algoritmo de validación para RUCs ecuatorianos
 */
private function validateRuc(string $ruc): bool
{
    // Verificar que sean solo dígitos
    if (!ctype_digit($ruc)) {
        return false;
    }

    // Validar longitud
    if (strlen($ruc) !== 13) {
        return false;
    }

    // Los primeros dos dígitos deben ser válidos para Ecuador (01-24)
    $provinceCode = substr($ruc, 0, 2);
    if ($provinceCode < '01' || $provinceCode > '24') {
        return false;
    }

    // El tercer dígito debe ser entre 0 y 6 o 9
    $thirdDigit = $ruc[2];
    if (!in_array($thirdDigit, ['0', '1', '2', '3', '4', '5', '6', '9'])) {
        return false;
    }

    // Si es persona natural (tercer dígito 0-5)
    if ($thirdDigit >= '0' && $thirdDigit <= '5') {
        // Los primeros 10 dígitos deben ser una cédula válida
        $cedula = substr($ruc, 0, 10);
        if (!$this->validateCedula($cedula)) {
            return false;
        }
        
        // Los últimos 3 dígitos deben ser 001
        $establishmentCode = substr($ruc, 10, 3);
        return $establishmentCode === '001';
    }
    
    // Si es sociedad privada o extranjera (tercer dígito 9)
    if ($thirdDigit === '9') {
        // Los últimos 3 dígitos deben ser 001
        $establishmentCode = substr($ruc, 10, 3);
        return $establishmentCode === '001';
    }
    
    // Si es institución pública (tercer dígito 6)
    if ($thirdDigit === '6') {
        // Los últimos 3 dígitos deben ser 0001
        $establishmentCode = substr($ruc, 10, 3);
        return $establishmentCode === '000';
    }

    return true;
}

    /**
     * Construye respuesta exitosa
     */
    private function successResponse(Sri $contribuyente, string $cacheKey): \Illuminate\Http\JsonResponse
    {
        $establishments = $contribuyente->establishments ?? [];
        $included = $this->formatEstablishments($establishments);

        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'data' => [
                'type' => 'sris',
                'id' => $contribuyente->identification,
                'attributes' => $this->formatContribuyenteAttributes($contribuyente),
                'relationships' => [
                    'establishments' => [
                        'data' => $this->formatEstablishmentsRelationships($establishments)
                    ]
                ]
            ],
            'included' => $included,
            'meta' => $this->buildMetaData($cacheKey, $included)
        ], 200);
    }

    /**
     * Formatea los atributos del contribuyente
     */
    private function formatContribuyenteAttributes(Sri $contribuyente): array
{
    return [
        'identification' => $contribuyente->identification,
        'business_name' => $contribuyente->business_name,
        'legal_name' => $contribuyente->legal_name,
        'commercial_name' => $contribuyente->commercial_name,
        'status' => $contribuyente->status,
        'taxpayer_status' => $contribuyente->taxpayer_status,
        'taxpayer_type' => $contribuyente->taxpayer_type,
        'regime' => $contribuyente->regime,
        'main_activity' => $contribuyente->main_activity,
        'accounting_required' => $contribuyente->accounting_required,
        'withholding_agent' => $contribuyente->withholding_agent,
        'special_taxpayer' => $contribuyente->special_taxpayer,
        'head_office_address' => $contribuyente->head_office_address,
        'debt_amount' => $contribuyente->debt_amount,
        'debt_description' => $contribuyente->debt_description,
        'ruc_number' => $contribuyente->identification,
        'company_name' => $contribuyente->legal_name,
        'taxpayer_dates_information' => [
            'start_date' => $contribuyente->start_date,
            'cessation_date' => $contribuyente->cessation_date,
            'restart_date' => $contribuyente->restart_date,
            'update_date' => $contribuyente->update_date,
        ],
        'legal_representatives' => $contribuyente->legal_representatives,
        'cancellation_reason' => $contribuyente->cancellation_reason,
        'ghost_taxpayer' => $contribuyente->ghost_taxpayer,
        'nonexistent_transactions' => $contribuyente->nonexistent_transactions,
    ];
}

    /**
     * Formatea los establecimientos para relaciones
     */
    private function formatEstablishmentsRelationships(array $establishments): array
    {
        return array_map(function ($est) {
            return [
                'type' => 'establishments',
                'id' => $est['numero_establecimiento'] ?? uniqid()
            ];
        }, $establishments);
    }

    /**
     * Formatea los establecimientos para included
     */
    private function formatEstablishments(array $establishments): array
    {
        return array_map(function ($est) {
            return [
                'type' => 'establishments',
                'id' => $est['numero_establecimiento'] ?? uniqid(),
                'attributes' => [
                    'number' => $est['numero_establecimiento'] ?? null,
                    'commercial_name' => $est['nombre_comercial'] ?? null,
                    'address' => $est['ubicacion_establecimiento'] ?? null,
                    'status' => $est['estado_establecimiento'] ?? null,
                    'department' => $est['department'] ?? null,
                    'province' => $est['province'] ?? null,
                    'district' => $est['district'] ?? null,
                    'parish' => $est['parish'] ?? null,
                    'establishment_type' => $est['tipo_establecimiento'] ?? null,
                    'address' => $est['ubicacion_establecimiento'] ?? null,
                    'estado' => $est['estado_establecimiento'] ?? null,
                    'establishment_number' => $est['numero_establecimiento'] ?? null,
                    'is_headquarters' => ($est['es_matriz'] ?? false) ? 'YES' : 'NO'
                ]
            ];
        }, $establishments);
    }

    /**
     * Construye los metadatos de la respuesta
     */
    private function buildMetaData(string $cacheKey, array $included): array
    {
        return [
            'cached' => Cache::has($cacheKey),
            'timestamp' => now()->toISOString(),
            'source' => 'SRI Ecuador',
            'establishments_count' => count($included),
            'cache_key' => $cacheKey
        ];
    }

    /**
     * Respuesta para errores de validación
     */
    private function validationErrorResponse(ValidationException $e): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'errors' => collect($e->errors())->map(function ($messages, $field) {
                return [
                    'status' => '422',
                    'title' => 'Error de validación',
                    'detail' => implode(' ', $messages),
                    'source' => [
                        'pointer' => "/data/attributes/" . str_replace('data.attributes.', '', $field)
                    ],
                    'meta' => [
                        'validation' => true,
                        'timestamp' => now()->toISOString()
                    ]
                ];
            })->values(),
        ], 422);
    }

    /**
     * Respuesta para contribuyente no encontrado
     */
    private function notFoundResponse(string $identification): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'errors' => [[
                'status' => '404',
                'title' => 'Contribuyente no encontrado',
                'detail' => 'No se encontró información para el identificador proporcionado',
                'meta' => [
                    'identification' => $identification,
                    'suggestion' => 'Verifique el número e intente nuevamente',
                    'reference' => 'https://srienlinea.sri.gob.ec',
                    'timestamp' => now()->toISOString()
                ]
            ]]
        ], 404);
    }

    /**
     * Respuesta para errores del servicio SRI
     */
    private function serviceErrorResponse(SriServiceException $e): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'errors' => [[
                'status' => '503',
                'title' => 'Servicio no disponible',
                'detail' => $e->getMessage(),
                'meta' => [
                    'retry_after' => 300,
                    'service_status' => 'https://estado.sri.gob.ec',
                    'timestamp' => now()->toISOString()
                ]
            ]]
        ], 503);
    }

    /**
     * Respuesta para errores internos del servidor
     */
    private function serverErrorResponse(\Exception $e, Request $request): \Illuminate\Http\JsonResponse
    {
        $errorId = uniqid('sri_err_');
        
        Log::error("Error en consulta SRI [$errorId]", [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request' => $request->all()
        ]);

        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'errors' => [[
                'status' => '500',
                'title' => 'Error interno del servidor',
                'detail' => 'Ocurrió un error inesperado. Nuestro equipo ha sido notificado.',
                'meta' => [
                    'error_id' => $errorId,
                    'timestamp' => now()->toISOString(),
                    'support' => 'soporte@tudominio.com'
                ]
            ]]
        ], 500);
    }

    /**
     * GET /api/v1/sris/info
     * Proporciona información sobre el uso de la API
     */
    public function info()
    {
        return response()->json([
            'jsonapi' => ['version' => '1.0'],
            'meta' => [
                'service' => 'API de Consulta SRI',
                'description' => 'Servicio para consultar información de contribuyentes registrados en el SRI Ecuador',
                'version' => '1.0.0',
                'documentation' => url('/api/docs/sri'),
                'endpoints' => [
                    [
                        'method' => 'POST',
                        'path' => '/api/v1/sris/search',
                        'description' => 'Consulta información de un contribuyente',
                        'parameters' => [
                            'data' => [
                                'type' => 'object',
                                'required' => true,
                                'properties' => [
                                    'attributes' => [
                                        'identification' => [
                                            'type' => 'string',
                                            'description' => 'Cédula o RUC (10-13 dígitos)',
                                            'example' => '0981459876001',
                                            'required' => true
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                'rate_limits' => [
                    'max_requests' => 100,
                    'per_minutes' => 1
                ],
                'contact' => 'soporte@tudominio.com'
            ]
        ]);
    }
}