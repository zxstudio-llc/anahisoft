import { ChartAreaInteractive } from '@/components/app/chart-area-interactive';
import { DataTable } from '@/components/app/data-table';
import { SectionCards } from '@/components/app/section-cards';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/layouts/customer/site-header"
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import data from "./data.json"
import { AppSidebar } from '@/layouts/customer/app-sidebar';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <SidebarProvider>  
        <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
                </div>
            </div>
            </div>
        </SidebarInset>
        </SidebarProvider>

        // <AppLayout breadcrumbs={breadcrumbs}>
        //     <Head title="Dashboard" />
        //     <div className="flex flex-1 flex-col">
        //         <div className="@container/main flex flex-1 flex-col gap-2">
        //             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        //             <SectionCards />
        //             <div className="px-4 lg:px-6">
        //                 <ChartAreaInteractive />
        //             </div>
        //             <DataTable data={data} />
        //             </div>
        //         </div>
        //     </div>
        // </AppLayout>
    );
}
