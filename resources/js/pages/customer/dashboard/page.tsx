import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';
import { CreditCard, Package, Receipt, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardData {
    stats: {
        sales: {
            value: string;
            change: number;
            trend: 'up' | 'down' | 'neutral';
        };
        clients: {
            value: number;
            newClients: number;
            trend: 'up' | 'down' | 'neutral';
        };
        products: {
            value: number;
            lowStock: number;
            trend: 'up' | 'down' | 'neutral';
        };
        invoices: {
            value: number;
            overdue: number;
            trend: 'up' | 'down' | 'neutral';
        };
    };
    recentActivity: Array<{
        action: string;
        time: string;
        client?: string;
        product?: string;
        invoice?: string;
    }>;
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <div className="text-2xl font-bold">{value}</div>
                </div>
                <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
            </CardHeader>
            {description && (
                <CardContent>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
            )}
        </Card>
    );
}

interface Props {
    dashboardData: DashboardData;
}

export default function Dashboard({ dashboardData }: Props) {
    const breadcrumbs = [
        { title: 'Inicio', href: '/' },
        { title: 'Dashboard', href: '/dashboard' },
    ];

    const { stats, recentActivity } = dashboardData;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Ventas del Mes"
                        value={stats.sales.value}
                        icon={<CreditCard className="h-5 w-5" />}
                        description={`${stats.sales.change}% más que el mes anterior`}
                    />
                    <StatsCard
                        title="Clientes"
                        value={stats.clients.value}
                        icon={<Users className="h-5 w-5" />}
                        description={`${stats.clients.newClients} nuevos esta semana`}
                    />
                    <StatsCard
                        title="Productos"
                        value={stats.products.value}
                        icon={<Package className="h-5 w-5" />}
                        description={`${stats.products.lowStock} productos con bajo stock`}
                    />
                    <StatsCard
                        title="Facturas Pendientes"
                        value={stats.invoices.value}
                        icon={<Receipt className="h-5 w-5" />}
                        description={`${stats.invoices.overdue} vencidas`}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Ventas Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed">
                                <p className="text-muted-foreground">Gráfico de ventas recientes</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {activity.action}
                                                {activity.client && ` - ${activity.client}`}
                                                {activity.product && ` - ${activity.product}`}
                                                {activity.invoice && ` - ${activity.invoice}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Hace {activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
