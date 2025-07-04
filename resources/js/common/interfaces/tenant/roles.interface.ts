export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    description: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
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
    data: Role[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface Filters {
    search?: string;
    sort_field?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
}

export interface IndexProps {
    roles: Pagination;
    permissions: Permission[];
    filters: Filters;
}

export interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    permissions: Permission[];
    role?: Role;
}

export interface RolesData {
    data: Role[];
    links?: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta?: {
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
    };
}

export const defaultFilters: Filters = {
    search: '',
    sort_field: 'name',
    sort_order: 'asc',
    per_page: 10,
};

export const defaultPagination: Pagination = {
    data: [],
    links: {
        first: null,
        last: null,
        prev: null,
        next: null,
    },
    meta: {
        current_page: 1,
        from: 0,
        last_page: 1,
        links: [],
        path: '',
        per_page: 10,
        to: 0,
        total: 0,
    },
};
