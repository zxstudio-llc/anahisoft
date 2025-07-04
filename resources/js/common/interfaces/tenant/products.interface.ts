export interface Product {
    id: number;
    code: string;
    name: string;
    description: string | null;
    price: number;
    cost: number;
    stock: number;
    unit_type: string;
    currency: string;
    igv_type: string;
    igv_percentage: number;
    has_igv: boolean;
    category_id: number | null;
    brand: string | null;
    model: string | null;
    barcode: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    products_count?: number;
}

export interface UnitType {
    value: string;
    label: string;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface Pagination {
    data: Product[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface Filters {
    search: string | null;
    category_id: number | null;
    is_active: boolean | null;
    sort_field: string;
    sort_order: string;
    per_page: number;
}

export interface IndexProps {
    products: Pagination;
    filters: Filters;
    categories: Category[];
    unit_types: UnitType[];
}

export interface IgvType {
    value: string;
    label: string;
}

export interface Currency {
    value: string;
    label: string;
}

export interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    unitTypes: UnitType[];
    igvTypes: IgvType[];
    currencies: Currency[];
    product?: Product;
}
