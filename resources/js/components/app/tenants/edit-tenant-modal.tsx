import { Tenant, EditTenantFormData } from '@/common/interfaces/tenants.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Building2, PencilIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EditTenantModalProps {
    tenant: Tenant;
    isOpen: boolean;
    onClose: () => void;
}

export function EditTenantModal({ tenant, isOpen, onClose }: EditTenantModalProps) {
    const [formData, setFormData] = useState<EditTenantFormData>({
        id: tenant.id,
        domain: tenant.primary_domain || '',
        company_name: tenant.company_name || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Actualizar el formulario cuando cambia el inquilino
    useEffect(() => {
        if (tenant) {
            setFormData({
                id: tenant.id,
                domain: tenant.primary_domain || '',
                company_name: tenant.company_name || '',
            });
        }
    }, [tenant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setIsSubmitting(true);
    //     setErrors({});

    //     try {
    //         // Enviar solicitud al servidor
    //         const response = await fetch(`/tenants/${tenant.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    //                 Accept: 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             // Manejar errores de validación
    //             if (response.status === 422 && data.errors) {
    //                 setErrors(data.errors);
    //             } else {
    //                 alert(data.message || 'Error al actualizar el inquilino');
    //             }
    //             setIsSubmitting(false);
    //             return;
    //         }

    //         // Éxito
    //         onClose();

    //         // Recargar la página para mostrar los cambios
    //         router.reload();
    //     } catch (error) {
    //         console.error('Error al actualizar inquilino:', error);
    //         alert('Error al procesar la solicitud');
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            router.put(
                route('admin.tenants.update', { tenant: tenant.id }),
                { ...formData },
                {
                    onSuccess: () => {
                        onClose();
                        router.reload();
                    },
                onError: (errors) => {
                    setErrors(errors);
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error('Error al actualizar inquilino:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Editar Inquilino</DialogTitle>
                    <DialogDescription>Modifique la información del inquilino.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección de información del inquilino */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Información de la Empresa</h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company_name" className="text-sm font-medium">
                                Nombre de la Empresa <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="Nombre de la empresa"
                                disabled={isSubmitting}
                                className="w-full"
                                autoFocus
                            />
                            {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="id" className="text-sm font-medium">
                                    ID del Inquilino
                                </Label>
                                <Input
                                    id="id"
                                    name="id"
                                    value={formData.id}
                                    disabled={true}
                                    className="w-full bg-neutral-50 dark:bg-neutral-800"
                                />
                                <p className="text-xs text-muted-foreground">El ID no se puede modificar.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="domain" className="text-sm font-medium">
                                    Dominio <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="domain"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    placeholder="mi-empresa.ejemplo.com"
                                    disabled={isSubmitting}
                                    className="w-full"
                                />
                                {errors.domain && <p className="text-sm text-red-500">{errors.domain}</p>}
                                <p className="text-xs text-muted-foreground">El dominio debe ser único.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
