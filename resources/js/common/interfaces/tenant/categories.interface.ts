export interface Category {
    id: number;
    name: string;
    description: string | null;
    products_count: number;
    is_active: boolean;
    created_at: string;
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
    data: Category[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface Filters {
    search: string | null;
    is_active: boolean | null;
    sort_field: string;
    sort_order: string;
    per_page: number;
}

export interface IndexProps {
    categories: Pagination;
    filters: Filters;
}
