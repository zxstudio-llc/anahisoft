export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
    last_login?: string;
    is_active: boolean;
    permissions?: string[];
}

export interface Role {
    id: number;
    name: string;
}

export interface UserStats {
    total: number;
    active: number;
    new_this_month: number;
    with_admin_role: number;
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
    data: User[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface Filters {
    search: string;
    role: string;
    sort_field: string;
    sort_order: 'asc' | 'desc';
    per_page: number;
}

export interface UsersPageProps {
    users: Pagination;
    roles: Role[];
    stats: UserStats;
    filters: Filters;
} 