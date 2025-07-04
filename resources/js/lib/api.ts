import { router } from '@inertiajs/react';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

function getBaseApiUrl(): string {
    const env = import.meta.env.VITE_APP_ENV || 'development';
  
    let domain = '';
  
    switch (env) {
      case 'production':
        domain = import.meta.env.VITE_API_DOMAIN_PRODUCTION;
        break;
      case 'staging':
        domain = import.meta.env.VITE_API_DOMAIN_STAGING;
        break;
      case 'development':
      default:
        domain = import.meta.env.VITE_API_DOMAIN_DEVELOPMENT;
        break;
    }
  
    return `${domain}/api/v1`;
  }

// Interfaz para los datos de validación de RUC
export interface RucValidationData {
    jsonapi: { version: string };
    data: {
        type: string;
        id: string;
        attributes: {
            identification: string;
            business_name: string | null;
            type: string | null;
            class: string | null;
            id_type: string | null;
            resolution: string | null;
            trade_name: string | null;
            head_office_address: string | null;
            info_date: string | null;
            message: string | null;
            status: string | null;
            debt_description: string | null;
            debt_amount: number | null;
            debt_fiscal_period: string | null;
            debt_beneficiary: string | null;
            debt_detail: string | null;
            legal_name: string | null;
            ruc: string | null;
            commercial_name: string | null;
            taxpayer_status: string | null;
            taxpayer_class: string | null;
            taxpayer_type: string | null;
            must_keep_accounting: string | null;
            main_activity: string | null;
            start_date: string | null;
            end_date: string | null;
            restart_date: string | null;
            update_date: string | null;
            mipymes_category: string | null;
            establishment: any[] | null;
            challenge: any | null;
            remission: any | null;
        };
    };
}

interface RequestOptions {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
}

class Api {
    private static baseUrl = getBaseApiUrl();
    private static defaultHeaders = {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    private static async request<T>(
        endpoint: string,
        method: string,
        data?: Record<string, unknown>,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                credentials: options.credentials || 'same-origin',
                ...(data ? { body: JSON.stringify(data) } : {}),
            });

            if (response.status === 429) {
                throw new Error('Has excedido el límite de solicitudes. Por favor, espera un momento antes de intentar nuevamente.');
            }

            const result = await response.json();

            if (!response.ok) {
                throw result;
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw { message: error.message };
            }
            throw error;
        }
    }

    static async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'GET', undefined, options);
    }

    static async post<T>(endpoint: string, data?: Record<string, unknown>, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'POST', data, options);
    }

    static async put<T>(endpoint: string, data?: Record<string, unknown>, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'PUT', data, options);
    }

    static async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, 'DELETE', undefined, options);
    }

    // Métodos específicos de la aplicación
    static async validateRuc(ruc: string): Promise<ApiResponse<RucValidationData>> {
        return this.post<RucValidationData>('/sris/search', {
            data: {
                type: 'sris',
                attributes: {
                    identification: ruc,
                },
            },
        }, {
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
            },
        });
    }

    // Método para manejar formularios con Inertia
    static submitForm(
        url: string,
        method: string,
        data: FormData,
        options: {
            onSuccess?: () => void;
            onError?: (errors: Record<string, string>) => void;
            onFinish?: () => void;
        } = {}
    ): void {
        router.post(url, data, {
            preserveScroll: true,
            onSuccess: options.onSuccess,
            onError: (errors) => {
                if (options.onError) {
                    const formattedErrors: Record<string, string> = {};
                    Object.keys(errors).forEach((key) => {
                        formattedErrors[key] = Array.isArray(errors[key]) 
                            ? errors[key][0] 
                            : errors[key];
                    });
                    options.onError(formattedErrors);
                }
            },
            onFinish: options.onFinish,
        });
    }
}

export default Api;
