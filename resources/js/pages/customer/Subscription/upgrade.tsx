import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, CreditCard } from 'lucide-react';
import { SubscriptionPlan, SubscriptionStatus } from '@/common/interfaces/subscription-plan.interface';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Props {
    currentPlan: SubscriptionPlan | null;
    availablePlans: SubscriptionPlan[];
    subscriptionStatus: SubscriptionStatus;
}

export default function Upgrade({ currentPlan, availablePlans, subscriptionStatus }: Props) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
    const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('monthly');
    
    const { data, setData, post, processing, errors } = useForm({
        plan_id: currentPlan?.id || '',
        payment_method: 'credit_card',
        billing_period: 'monthly',
    });

    const handlePlanSelect = (planId: number) => {
        setData('plan_id', planId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/subscription/process-payment');
    };

    const formatPrice = (price: number, billingPeriod: string) => {
        return `${price.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}/${billingPeriod === 'monthly' ? 'mes' : 'año'}`;
    };

    return (
        <AppLayout>
            <Head title="Actualizar Suscripción" />

            <div className="container py-6">
                <h1 className="text-2xl font-bold mb-6">Actualizar Suscripción</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Seleccione un Plan</CardTitle>
                                <CardDescription>
                                    Elija el plan que mejor se adapte a sus necesidades
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <RadioGroup 
                                        value={String(data.plan_id)} 
                                        onValueChange={(value) => handlePlanSelect(Number(value))}
                                    >
                                        {availablePlans.map((plan) => (
                                            <div 
                                                key={plan.id} 
                                                className={`flex items-center justify-between p-4 border rounded-md ${
                                                    data.plan_id === plan.id ? 'border-primary bg-primary/5' : 'border-border'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem value={String(plan.id)} id={`plan-${plan.id}`} />
                                                    <div>
                                                        <Label htmlFor={`plan-${plan.id}`} className="text-base font-medium flex items-center">
                                                            {plan.name}
                                                            {plan.is_featured && (
                                                                <Badge className="ml-2">Recomendado</Badge>
                                                            )}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {plan.invoice_limit === 0 
                                                                ? 'Facturas ilimitadas' 
                                                                : `${plan.invoice_limit} facturas/mes`}
                                                        </p>
                                                        <ul className="mt-2 space-y-1">
                                                            {plan.features?.map((feature, index) => (
                                                                <li key={index} className="text-sm flex items-center">
                                                                    <Check className="h-3 w-3 text-primary mr-2" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(plan.price, selectedBillingPeriod)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>

                                    {errors.plan_id && (
                                        <div className="text-sm text-red-500">{errors.plan_id}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Opciones de Facturación</CardTitle>
                                <CardDescription>
                                    Seleccione su periodo de facturación preferido
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup 
                                    value={data.billing_period} 
                                    onValueChange={(value) => {
                                        setData('billing_period', value);
                                        setSelectedBillingPeriod(value);
                                    }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div className={`flex items-center justify-between p-4 border rounded-md ${
                                        data.billing_period === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="monthly" id="monthly" />
                                            <div>
                                                <Label htmlFor="monthly" className="text-base font-medium">
                                                    Mensual
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Facturación cada mes
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center justify-between p-4 border rounded-md ${
                                        data.billing_period === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="yearly" id="yearly" />
                                            <div>
                                                <Label htmlFor="yearly" className="text-base font-medium">
                                                    Anual
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Facturación cada año (ahorro del 15%)
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            Ahorro 15%
                                        </Badge>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Método de Pago</CardTitle>
                                <CardDescription>
                                    Seleccione su método de pago preferido
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup 
                                    value={data.payment_method} 
                                    onValueChange={(value) => {
                                        setData('payment_method', value);
                                        setSelectedPaymentMethod(value);
                                    }}
                                    className="space-y-4"
                                >
                                    <div className={`flex items-center p-4 border rounded-md ${
                                        data.payment_method === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border'
                                    }`}>
                                        <RadioGroupItem value="credit_card" id="credit_card" />
                                        <Label htmlFor="credit_card" className="flex items-center ml-3">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Tarjeta de Crédito/Débito
                                        </Label>
                                    </div>
                                    <div className={`flex items-center p-4 border rounded-md ${
                                        data.payment_method === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border'
                                    }`}>
                                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                        <Label htmlFor="bank_transfer" className="ml-3">
                                            Transferencia Bancaria
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.plan_id ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Plan:</span>
                                            <span className="font-medium">
                                                {availablePlans.find(p => p.id === Number(data.plan_id))?.name || 'Plan seleccionado'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Periodo:</span>
                                            <span className="font-medium">
                                                {data.billing_period === 'monthly' ? 'Mensual' : 'Anual'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Método de pago:</span>
                                            <span className="font-medium">
                                                {data.payment_method === 'credit_card' ? 'Tarjeta' : 'Transferencia'}
                                            </span>
                                        </div>
                                        <div className="border-t pt-4 mt-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Total:</span>
                                                <span className="font-bold">
                                                    {formatPrice(
                                                        availablePlans.find(p => p.id === Number(data.plan_id))?.price || 0,
                                                        data.billing_period
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                        <p className="text-sm">Por favor, seleccione un plan para continuar.</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full" 
                                    onClick={handleSubmit}
                                    disabled={!data.plan_id || processing}
                                >
                                    {processing ? 'Procesando...' : 'Confirmar y Pagar'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 