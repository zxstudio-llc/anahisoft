import { Tenant } from '@/common/interfaces/tenants.interface';
import { Card } from '@/components/ui/card';
import { Building2, PencilIcon, Users } from 'lucide-react';
import { useState } from 'react';
import { CreateTenantModal } from './create-tenant-modal';
import { EditTenantModal } from './edit-tenant-modal';

interface TenantsTableProps {
    tenants: Tenant[];
    app_domain: string;
}

export function TenantsTable({ tenants, app_domain }: TenantsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof Tenant>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSort = (field: keyof Tenant) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleEdit = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTenant(null);
    };

    const filteredTenants = tenants.filter((tenant) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            tenant.id.toLowerCase().includes(searchLower) ||
            (tenant.primary_domain && tenant.primary_domain.toLowerCase().includes(searchLower)) ||
            (tenant.company_name && tenant.company_name.toLowerCase().includes(searchLower))
        );
    });

    const sortedTenants = [...filteredTenants].sort((a, b) => {
        if (sortField === 'domains_count' || sortField === 'users_count') {
            const valueA = a[sortField] || 0;
            const valueB = b[sortField] || 0;
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        if (sortField === 'created_at' || sortField === 'updated_at') {
            const dateA = new Date(a[sortField] || 0).getTime();
            const dateB = new Date(b[sortField] || 0).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        const valueA = String(a[sortField] || '');
        const valueB = String(b[sortField] || '');
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    return (
        <>
            <Card className="overflow-hidden">
                <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Inquilinos</h3>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar inquilinos..."
                                    className="w-64 rounded-md border px-3 py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="absolute top-2.5 right-3 h-5 w-5 text-gray-400"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <CreateTenantModal domain={app_domain} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-neutral-50 text-xs uppercase dark:bg-neutral-800">
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('id')}>
                                    <div className="flex items-center space-x-1">
                                        <span>ID</span>
                                        {sortField === 'id' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('company_name')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Empresa</span>
                                        {sortField === 'company_name' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('primary_domain')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Dominio</span>
                                        {sortField === 'primary_domain' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('domains_count')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Dominios</span>
                                        {sortField === 'domains_count' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('users_count')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Usuarios</span>
                                        {sortField === 'users_count' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('created_at')}>
                                    <div className="flex items-center space-x-1">
                                        <span>Creado</span>
                                        {sortField === 'created_at' && <SortIcon direction={sortDirection} />}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                                        No se encontraron inquilinos
                                    </td>
                                </tr>
                            ) : (
                                sortedTenants.map((tenant) => (
                                    <tr key={tenant.id} className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="px-4 py-3 font-medium">{tenant.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-neutral-400" />
                                                {tenant.company_name || <span className="text-neutral-400">Sin nombre</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {tenant.primary_domain ? (
                                                <a
                                                    href={`https://${tenant.primary_domain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {tenant.primary_domain}
                                                </a>
                                            ) : (
                                                <span className="text-neutral-400">Sin dominio</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {tenant.domains_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-neutral-400" />
                                                <span>{tenant.users_count || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                                            {new Date(tenant.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    title="Editar"
                                                    onClick={() => handleEdit(tenant)}
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Eliminar">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-4 w-4 text-red-500"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {editingTenant && <EditTenantModal tenant={editingTenant} isOpen={isEditModalOpen} onClose={closeEditModal} />}
        </>
    );
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' }) {
    return direction === 'asc' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
            />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
            />
        </svg>
    );
}
