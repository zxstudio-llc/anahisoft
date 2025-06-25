import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FilePlus, Search } from 'lucide-react';
import { useState } from 'react';

interface Invoice {
    id: number;
    number: string;
    client_name: string;
    date: string;
    total: number;
    status: string;
}

interface Filters {
    search: string;
    status: string;
    sort_field: string;
    sort_order: string;
    per_page: number;
}

interface Props {
    invoices: Invoice[];
    filters: Filters;
}

export default function Index({ invoices = [], filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/invoices', { search: searchTerm, status }, { preserveState: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/invoices', { search: searchTerm, status: value }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Facturas" />
            <div className="container py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Facturas</h1>
                    <Button onClick={() => router.get('/invoices/create')}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Nueva Factura
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Listado de Facturas</CardTitle>
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 md:w-96">
                                <Input
                                    placeholder="Buscar facturas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                                <Button type="submit" size="icon" variant="ghost">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos</SelectItem>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="sent">Enviada</SelectItem>
                                    <SelectItem value="paid">Pagada</SelectItem>
                                    <SelectItem value="overdue">Vencida</SelectItem>
                                    <SelectItem value="cancelled">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                        <th className="px-4 py-3">Número</th>
                                        <th className="px-4 py-3">Cliente</th>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Estado</th>
                                        <th className="px-4 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                                                No se encontraron facturas
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="border-b border-neutral-200 bg-white text-sm last:border-0 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                                            >
                                                <td className="px-4 py-3 font-medium">{invoice.number}</td>
                                                <td className="px-4 py-3">{invoice.client_name}</td>
                                                <td className="px-4 py-3">
                                                    {new Date(invoice.date).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {invoice.total.toLocaleString('es-ES', {
                                                        style: 'currency',
                                                        currency: 'PEN',
                                                    })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            invoice.status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : invoice.status === 'sent'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : invoice.status === 'overdue'
                                                                ? 'bg-red-100 text-red-800'
                                                                : invoice.status === 'draft'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {invoice.status === 'paid'
                                                            ? 'Pagada'
                                                            : invoice.status === 'sent'
                                                            ? 'Enviada'
                                                            : invoice.status === 'overdue'
                                                            ? 'Vencida'
                                                            : invoice.status === 'draft'
                                                            ? 'Borrador'
                                                            : 'Cancelada'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.get(`/invoices/${invoice.id}`)}
                                                        >
                                                            Ver
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.get(`/invoices/${invoice.id}/edit`)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 