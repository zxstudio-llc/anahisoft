import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { ArrowLeft, Mail, MapPin, Pencil, Phone, Trash2, UserCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  created_at: string;
}

interface ShowProps {
  client: Client;
}

export default function Show({ client }: ShowProps) {
  const breadcrumbs = [
    { title: 'Inicio', href: '/' },
    { title: 'Clientes', href: '/clients' },
    { title: client.name, href: `/clients/${client.id}` },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Detalles del Cliente</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">Cliente #{client.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone || 'No especificado'}</span>
                </div>
                {(client.address || client.city) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      {client.address && <div>{client.address}</div>}
                      {client.city && <div>{client.city}</div>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de registro</span>
                  <span>{client.created_at}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de compras</span>
                  <span>0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Última compra</span>
                  <span>N/A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total gastado</span>
                  <span>$0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compras Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-8 text-center">
              <p className="text-muted-foreground">Este cliente no tiene compras registradas.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
} 