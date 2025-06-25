import { type NavItem } from '@/types';
import {BookOpen, Building, Cog, CreditCard, Folder, Key, LayoutDashboard, Package, ShoppingCart, Users, Receipt, DollarSign, LayoutGrid, Ticket, Trophy, Search, List, ImagePlay, Images, BarChart, FileText, MessageSquare, NotebookText, ShieldEllipsis } from 'lucide-react';


export const centralNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'Inquilinos',
        href: '/admin/tenants',
        icon: Building,
    },
    {
        title: 'Suscripciones',
        href: '/admin/subscription-plans',
        icon: CreditCard,
    },
    {
        title: 'Pagos',
        href: '/admin/payments',
        icon: DollarSign,
    },
    {
        title: 'Configuración',
        href: '/settings/profile',
        icon: Cog,
    },
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Roles y permisos',
        href: '/admin/roles',
        icon: ShieldEllipsis,
    },
    {
      title: 'Páginas',
      href: '/admin/pages',
      icon: FileText,
    },
    {
      title: 'Noticias/Blog',
      href: '/admin/news',
      icon: NotebookText,
    },
    {
      title: 'Media',
      href: '/admin/media',
      icon: Images,
    },
    {
      title: 'Banners',
      href: '/admin/banners',
      icon: ImagePlay,
    },
    {
      title: 'Menús',
      href: '/admin/menus',
      icon: List,
    },
    {
      title: 'Testimonios',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      title: 'SEO',
      href: '/admin/seo',
      icon: Search,
    },
    {
      title: 'Analítica',
      href: '/admin/analytics',
      icon: BarChart, 
    },
    // {
    //   title: 'Temas',
    //   href: '/admin/themes',
    //   icon: BarChart, 
    // },
    {
      title: 'Configuracion',
      href: '/admin/settings',
      icon: Cog, 
    },
    {
        title: 'Footer',
        href: '/admin/footers/manage',
        icon: BarChart, 
    }
];

export const tenantNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Clientes',
        href: '/clients',
        icon: Users,
    },
    {
        title: 'Productos',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Ventas',
        href: '/sales',
        icon: ShoppingCart,
    },
    {
        title: 'Categorías',
        href: '/categories',
        icon: Folder,
    },
    {
        title: 'API Keys',
        href: '/api-keys',
        icon: Key,
    },
    {
        title: 'Facturación',
        href: '/invoices',
        icon: Receipt,
    },
    {
        title: 'Suscripción',
        href: '/subscription',
        icon: CreditCard,
    },
    {
        title: 'Configuración',
        href: '/settings/profile',
        icon: Cog,
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
