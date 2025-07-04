import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Save, X } from 'lucide-react';
import React, { useState } from 'react';

interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: number;
    billing_period: 'monthly' | 'yearly';
    invoice_limit: number;
    features: string[];
    is_active: boolean;
    is_featured: boolean;
}

interface Props {
    plan: SubscriptionPlan;
}

export default function Edit({ plan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        price: plan.price,
        billing_period: plan.billing_period,
        invoice_limit: plan.invoice_limit,
        features: plan.features || [],
        is_active: plan.is_active,
        is_featured: plan.is_featured,
    });

    const [newFeature, setNewFeature] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subscription-plans/${plan.id}`);
    };

    const addFeature = () => {
        if (newFeature.trim() !== '') {
            setData('features', [...data.features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        const updatedFeatures = [...data.features];
        updatedFeatures.splice(index, 1);
        setData('features', updatedFeatures);
    };

    return (
        <AppLayout>
            <Head title="Editar Plan de Suscripción" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container py-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Editar Plan de Suscripción</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="price">Precio</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="billing_period">Periodo de Facturación</Label>
                                        <Select
                                            value={data.billing_period}
                                            onValueChange={(value) => setData('billing_period', value as 'monthly' | 'yearly')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un periodo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Mensual</SelectItem>
                                                <SelectItem value="yearly">Anual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.billing_period && <p className="text-sm text-red-500">{errors.billing_period}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="invoice_limit">Límite de Facturas (0 para ilimitado)</Label>
                                    <Input
                                        id="invoice_limit"
                                        type="number"
                                        min="0"
                                        value={data.invoice_limit}
                                        onChange={(e) => setData('invoice_limit', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.invoice_limit && <p className="text-sm text-red-500">{errors.invoice_limit}</p>}
                                </div>

                                <div>
                                    <Label>Características</Label>
                                    <div className="mt-1 flex space-x-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Añadir nueva característica"
                                        />
                                        <Button type="button" onClick={addFeature}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        {data.features.map((feature, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-md bg-muted p-2">
                                                <span>{feature}</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_active">Plan activo</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_featured">Plan destacado</Label>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Actualizar Plan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
