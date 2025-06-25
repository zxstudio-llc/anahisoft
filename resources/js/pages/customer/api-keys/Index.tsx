import { ApiKeysProps } from '@/common/interfaces/tenant/apikey.interface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateApiKeyModal from '@/components/tenants/create-apikey-modal';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Key, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function Index({ tokens = [] }: ApiKeysProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<number | null>(null);

    const breadcrumbs = [
        { title: 'Inicio', href: '/' },
        { title: 'API Keys', href: '/api-keys' },
    ];

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta API Key? Esta acción no se puede deshacer.')) {
            return;
        }

        setLoading(id);
        
        try {
            const response = await axios.delete(`/api-keys/${id}`);
            
            if (response.data.success) {
                router.reload();
            } else {
                alert(response.data.message || 'Error al eliminar la API Key');
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            alert(err.response?.data?.message || 'Error al eliminar la API Key');
        } finally {
            setLoading(null);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="API Keys" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">API Keys</h1>
                        <Link href="/api-keys/docs" className="text-primary hover:underline">
                            Ver documentación API
                        </Link>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva API Key
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Tus API Keys</CardTitle>
                        <CardDescription>
                            Las API Keys te permiten acceder a la API desde aplicaciones externas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                                            <th className="px-4 py-3">Nombre</th>
                                            <th className="px-4 py-3">Permisos</th>
                                            <th className="px-4 py-3">Último uso</th>
                                            <th className="px-4 py-3">Creada</th>
                                            <th className="px-4 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokens.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                                                    No tienes API Keys creadas
                                                </td>
                                            </tr>
                                        ) : (
                                            tokens.map((token) => (
                                                <tr key={token.id} className="border-t">
                                                    <td className="flex items-center gap-2 px-4 py-3">
                                                        <Key className="h-5 w-5 text-muted-foreground" />
                                                        {token.name}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {token.abilities.map((ability) => (
                                                                <span 
                                                                    key={ability} 
                                                                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                                                >
                                                                    {ability}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">{token.last_used_at}</td>
                                                    <td className="px-4 py-3">{token.created_at}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500"
                                                            onClick={() => handleDelete(token.id)}
                                                            disabled={loading === token.id}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Eliminar</span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CreateApiKeyModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </AppSidebarLayout>
    );
} 