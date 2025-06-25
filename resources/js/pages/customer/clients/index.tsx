import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, UserCircle } from 'lucide-react';
import { useState } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface IndexProps {
  clients: Client[];
}

export default function Index({ clients }: IndexProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const breadcrumbs = [
    { title: 'Inicio', href: '/' },
    { title: 'Clientes', href: '/clients' },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button asChild>
            <Link href="/clients/create">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gestión de Clientes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar clientes..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Teléfono</th>
                      <th className="px-4 py-3">Fecha de Registro</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                          No se encontraron clientes
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="border-t">
                          <td className="px-4 py-3">{client.id}</td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-muted-foreground" />
                            {client.name}
                          </td>
                          <td className="px-4 py-3">{client.email}</td>
                          <td className="px-4 py-3">{client.phone}</td>
                          <td className="px-4 py-3">{client.created_at}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/clients/${client.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Ver</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/clients/${client.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
} 