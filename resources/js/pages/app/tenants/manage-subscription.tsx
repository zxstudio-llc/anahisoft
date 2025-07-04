import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import TenantPayments from '@/components/tenants/tenant-payments';

interface Tenant {
    id: string;
    company_name: string;
    primary_domain: string;
    subscription_plan?: {
        id: number;
        name: string;
    };
    subscription_status: string;
    trial_ends_at: string | null;
    subscription_ends_at: string | null;
    subscription_active: boolean;
    is_active: boolean;
}

interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    billing_period: 'monthly' | 'yearly';
    invoice_limit: number;
}

interface Props {
    tenant: Tenant;
    subscriptionPlans: SubscriptionPlan[];
    payments: any[];
}

export default function ManageSubscription({ tenant, subscriptionPlans, payments }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        subscription_plan_id: tenant.subscription_plan ? tenant.subscription_plan.id.toString() : '',
        trial_ends_at: tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toISOString().split('T')[0] : '',
        subscription_active: tenant.subscription_active,
        subscription_ends_at: tenant.subscription_ends_at ? new Date(tenant.subscription_ends_at).toISOString().split('T')[0] : '',
        is_active: tenant.is_active,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await axios.post(route('tenants.update-subscription', tenant.id), formData);
            setIsUpdating(false);
            toast.success('Suscripción actualizada correctamente');
            router.reload();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            toast.error('Error al actualizar la suscripción');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">Activo</Badge>;
            case 'trial':
                return <Badge className="bg-blue-500">Prueba</Badge>;
            case 'expired':
                return <Badge className="bg-red-500">Expirado</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-500">Inactivo</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Datos para el componente de pagos
    const paymentMethods = [
        { value: 'credit_card', label: 'Tarjeta de Crédito' },
        { value: 'bank_transfer', label: 'Transferencia Bancaria' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'cash', label: 'Efectivo' },
        { value: 'other', label: 'Otro' },
    ];

    return (
        <>
            <Head title={`Gestionar Suscripción - ${tenant.company_name}`} />

            <div className="container py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={route('tenants.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Gestionar Suscripción</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Inquilino</CardTitle>
                                <CardDescription>Detalles del inquilino y su suscripción actual.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">ID del Inquilino</h3>
                                        <p className="mt-1 text-lg font-medium">{tenant.id}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Nombre de la Empresa</h3>
                                        <p className="mt-1 text-lg font-medium">{tenant.company_name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Dominio Principal</h3>
                                        <p className="mt-1 text-lg font-medium">
                                            <a href={`https://${tenant.primary_domain}`} target="_blank" className="text-blue-600 hover:underline">
                                                {tenant.primary_domain}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            {tenant.is_active ? (
                                                <Badge className="bg-green-500">Activo</Badge>
                                            ) : (
                                                <Badge className="bg-red-500">Bloqueado</Badge>
                                            )}
                                            {getStatusBadge(tenant.subscription_status)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Plan Actual</h3>
                                        <p className="mt-1 text-lg font-medium">
                                            {tenant.subscription_plan ? tenant.subscription_plan.name : 'Sin plan asignado'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Fin del Período de Prueba</h3>
                                        <p className="mt-1 text-lg font-medium">{formatDate(tenant.trial_ends_at)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Fin de la Suscripción</h3>
                                        <p className="mt-1 text-lg font-medium">{formatDate(tenant.subscription_ends_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <TenantPayments 
                            tenant={tenant} 
                            payments={payments} 
                            subscriptionPlans={subscriptionPlans} 
                            paymentMethods={paymentMethods} 
                        />
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Actualizar Suscripción</CardTitle>
                                <CardDescription>Modifique los detalles de la suscripción del inquilino.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full mb-4">Actualizar Suscripción</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[550px]">
                                        <form onSubmit={handleSubmit}>
                                            <DialogHeader>
                                                <DialogTitle>Actualizar Suscripción</DialogTitle>
                                                <DialogDescription>
                                                    Modifique los detalles de la suscripción para este inquilino.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="subscription_plan_id">Plan de Suscripción</Label>
                                                    <Select
                                                        name="subscription_plan_id"
                                                        value={formData.subscription_plan_id}
                                                        onValueChange={(value) => handleSelectChange('subscription_plan_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione un plan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {subscriptionPlans.map((plan) => (
                                                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                                                    {plan.name} - ${plan.price}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.subscription_plan_id && (
                                                        <p className="text-red-500 text-sm">{errors.subscription_plan_id}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="trial_ends_at">Fin del Período de Prueba</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="trial_ends_at"
                                                            name="trial_ends_at"
                                                            type="date"
                                                            value={formData.trial_ends_at}
                                                            onChange={handleInputChange}
                                                        />
                                                        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                                    </div>
                                                    {errors.trial_ends_at && <p className="text-red-500 text-sm">{errors.trial_ends_at}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="subscription_ends_at">Fin de la Suscripción</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="subscription_ends_at"
                                                            name="subscription_ends_at"
                                                            type="date"
                                                            value={formData.subscription_ends_at}
                                                            onChange={handleInputChange}
                                                        />
                                                        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                                    </div>
                                                    {errors.subscription_ends_at && (
                                                        <p className="text-red-500 text-sm">{errors.subscription_ends_at}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        id="subscription_active"
                                                        name="subscription_active"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        checked={formData.subscription_active}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Label htmlFor="subscription_active">Suscripción Activa</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        id="is_active"
                                                        name="is_active"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        checked={formData.is_active}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Label htmlFor="is_active">Inquilino Activo</Label>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsUpdating(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Actualizando...' : 'Actualizar Suscripción'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Link href={route('tenants.reset-admin', tenant.id)} className="w-full">
                                    <Button variant="outline" className="w-full mb-4">
                                        Resetear Credenciales de Admin
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        router.visit(route('tenants.index'));
                                    }}
                                >
                                    Volver a la Lista
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
} 