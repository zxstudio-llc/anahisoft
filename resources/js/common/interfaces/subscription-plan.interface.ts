export interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: number;
    billing_period: 'monthly' | 'yearly';
    invoice_limit: number;
    features: string[];
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionStatus {
    isActive: boolean;
    onTrial: boolean;
    trialEndsAt: string | null;
    subscriptionEndsAt: string | null;
}

export interface InvoiceUsage {
    total: number;
    monthly: number;
    limit: number;
    percentage: number;
} 