import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';
import { CreditCard, Package, Receipt, Users } from 'lucide-react';
import { ReactNode } from 'react';

// Tipos
type Trend = 'up' | 'down' | 'neutral';

interface StatItem {
  value: string | number;
  trend: Trend;
}

interface SalesStat extends StatItem {
  change: number;
}

interface ClientsStat extends StatItem {
  newClients: number;
}

interface ProductsStat extends StatItem {
  lowStock: number;
}

interface InvoicesStat extends StatItem {
  overdue: number;
}

interface RecentActivity {
  action: string;
  time: string;
  client?: string;
  product?: string;
  invoice?: string;
}

interface DashboardStats {
  sales: SalesStat;
  clients: ClientsStat;
  products: ProductsStat;
  invoices: InvoicesStat;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

interface Props {
  dashboardData?: DashboardData;
  isLoading?: boolean;
  error?: string;
}

// Componentes pequeños
function StatsCard({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}) {
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

function RecentSalesChart() {
  return (
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
  );
}

function RecentActivityList({ activities }: { activities: RecentActivity[] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
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
  );
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
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
  );
}

function DataGrid({ recentActivity }: { recentActivity: RecentActivity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <RecentSalesChart />
      <RecentActivityList activities={recentActivity} />
    </div>
  );
}

export default function Dashboard({ dashboardData, isLoading, error }: Props) {
  const breadcrumbs = [
    { title: 'Inicio', href: '/' },
    { title: 'Dashboard', href: '/dashboard' },
  ];

  if (isLoading) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex flex-1 items-center justify-center p-8">
          <p>Cargando datos del dashboard...</p>
        </div>
      </AppSidebarLayout>
    );
  }

  if (error) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <Head title="Error en Dashboard" />
        <div className="flex flex-1 items-center justify-center p-8 text-destructive">
          <p>Error al cargar los datos: {error}</p>
        </div>
      </AppSidebarLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard no disponible" />
        <div className="flex flex-1 items-center justify-center p-8">
          <p>No hay datos disponibles para mostrar</p>
        </div>
      </AppSidebarLayout>
    );
  }

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <StatsGrid stats={dashboardData.stats} />
        <DataGrid recentActivity={dashboardData.recentActivity} />
      </div>
    </AppSidebarLayout>
  );
}