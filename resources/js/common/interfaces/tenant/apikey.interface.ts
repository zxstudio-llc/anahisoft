export interface ApiKey {
    id: number;
    name: string;
    abilities: string[];
    last_used_at: string;
    created_at: string;
}

export interface ApiKeyFormData {
    name: string;
    abilities: string[];
}

export interface ApiKeyResponse {
    success: boolean;
    token?: string;
    message: string;
}

export interface ApiKeysProps {
    tokens: ApiKey[];
}
