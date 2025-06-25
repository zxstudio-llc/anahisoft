import { IndexProps } from '@/common/interfaces/tenant/categories.interface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FolderTree, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ 
    categories = { 
        data: [], 
        meta: { 
            current_page: 1,
            from: 0,
            last_page: 1,
            links: [],
            path: '',
            per_page: 10,
            to: 0,
            total: 0
        },
        links: {
            first: null,
            last: null,
            prev: null,
            next: null
        }
    }, 
    filters = { 
        search: '', 
        is_active: null, 
        sort_field: 'name', 
        sort_order: 'asc', 
        per_page: 10 
    } 
}: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/categories',
            { search: searchTerm },
            { preserveState: true },
        );
    };

    const handleSort = (field: string) => {
        const newOrder = filters?.sort_field === field && filters?.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(
            '/categories',
            {
                ...filters,
                sort_field: field,
                sort_order: newOrder,
            },
            { preserveState: true },
        );
    };

    const breadcrumbs = [
        { title: 'Inicio', href: '/' },
        { title: 'Categorías', href: '/categories' },
    ];

    // Asegurarse de que categories.data existe y es un array
    const categoryData = Array.isArray(categories?.data) ? categories.data : [];
    const meta = categories?.meta || { last_page: 1, from: 0, to: 0, total: 0, links: [] };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categorías</h1>
                    <Button asChild>
                        <Link href="/categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Gestión de Categorías</CardTitle>
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar categorías..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="secondary">
                                Buscar
                            </Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                                            <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('id')}>
                                                ID
                                                {filters?.sort_field === 'id' && (
                                                    <span className="ml-1">{filters?.sort_order === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('name')}>
                                                Nombre
                                                {filters?.sort_field === 'name' && (
                                                    <span className="ml-1">{filters?.sort_order === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="px-4 py-3">Descripción</th>
                                            <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('products_count')}>
                                                Productos
                                                {filters?.sort_field === 'products_count' && (
                                                    <span className="ml-1">{filters?.sort_order === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('is_active')}>
                                                Estado
                                                {filters?.sort_field === 'is_active' && (
                                                    <span className="ml-1">{filters?.sort_order === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryData.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                                                    No se encontraron categorías
                                                </td>
                                            </tr>
                                        ) : (
                                            categoryData.map((category) => (
                                                <tr key={category.id} className="border-t">
                                                    <td className="px-4 py-3">{category.id}</td>
                                                    <td className="flex items-center gap-2 px-4 py-3">
                                                        <FolderTree className="h-5 w-5 text-muted-foreground" />
                                                        {category.name}
                                                    </td>
                                                    <td className="px-4 py-3">{category.description || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
                                                            {category.products_count}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                category.is_active
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {category.is_active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" asChild>
                                                                <Link href={`/categories/${category.id}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                    <span className="sr-only">Ver</span>
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="icon" asChild>
                                                                <Link href={`/categories/${category.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                    <span className="sr-only">Editar</span>
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500"
                                                                onClick={() => {
                                                                    if (category.products_count > 0) {
                                                                        alert('No se puede eliminar esta categoría porque tiene productos asociados');
                                                                        return;
                                                                    }
                                                                    if (confirm('¿Está seguro de eliminar esta categoría?')) {
                                                                        router.delete(`/categories/${category.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Eliminar</span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Paginación */}
                            {meta.last_page > 1 && (
                                <div className="flex items-center justify-between border-t px-4 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {meta.from} a {meta.to} de {meta.total} resultados
                                    </div>
                                    <div className="flex gap-1">
                                        {meta.links && meta.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
