import { CreateTenantFormData, CreateTenantResponse } from '@/common/interfaces/tenants.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Building2, PlusCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CreateTenantModal({ domain }: { domain: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<CreateTenantFormData>({
        id: '',
        domain: '',
        company_name: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoGenerate, setAutoGenerate] = useState(true);

    // Generar ID y dominio automáticamente a partir del nombre de la empresa
    useEffect(() => {
        if (autoGenerate && formData.company_name) {
            // Convertir a minúsculas, reemplazar espacios por guiones y eliminar caracteres especiales
            const baseId = formData.company_name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                .replace(/[^a-z0-9\s-]/g, '') // Solo permitir letras, números, espacios y guiones
                .replace(/\s+/g, '-') // Reemplazar espacios por guiones
                .replace(/-+/g, '-') // Evitar guiones múltiples
                .trim();

            setFormData((prev) => ({
                ...prev,
                id: baseId,
                domain: `${baseId}.${domain}`,
            }));
        }
    }, [formData.company_name, autoGenerate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Si se modifica manualmente el ID o dominio, desactivar la generación automática
        if ((name === 'id' || name === 'domain') && value !== '') {
            setAutoGenerate(false);
        }

        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post('tenants', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                resetForm();
            },
            onError: (errors) => {
                // Convertir los errores de Inertia al formato que espera tu componente
                const formattedErrors: Record<string, string> = {};

                // Inertia devuelve los errores como un objeto con arrays
                Object.keys(errors).forEach(key => {
                    if (Array.isArray(errors[key])) {
                        formattedErrors[key] = errors[key][0]; // Tomamos el primer mensaje de error
                    } else {
                        formattedErrors[key] = errors[key];
                    }
                });

                setErrors(formattedErrors);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const resetForm = () => {
        setFormData({
            id: '',
            domain: '',
            company_name: '',
            admin_name: '',
            admin_email: '',
            admin_password: '',
        });
        setErrors({});
        setAutoGenerate(true);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Nuevo Inquilino</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Inquilino</DialogTitle>
                    <DialogDescription>Ingrese la información para crear un nuevo inquilino y su dominio asociado.</DialogDescription>
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
                            <p className="text-xs text-muted-foreground">El ID y dominio se generarán automáticamente a partir del nombre.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="id" className="text-sm font-medium">
                                        ID del Inquilino <span className="text-red-500">*</span>
                                    </Label>
                                    <label className="flex items-center gap-1 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={autoGenerate}
                                            onChange={(e) => setAutoGenerate(e.target.checked)}
                                            className="h-3 w-3"
                                        />
                                        Auto
                                    </label>
                                </div>
                                <Input
                                    id="id"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    placeholder="mi-empresa"
                                    disabled={isSubmitting || autoGenerate}
                                    className={`w-full ${autoGenerate ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`}
                                />
                                {errors.id && <p className="text-sm text-red-500">{errors.id}</p>}
                                <p className="text-xs text-muted-foreground">ID único para identificar al inquilino en el sistema.</p>
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
                                    placeholder={`${formData.id}.${domain}`}
                                    disabled={isSubmitting || autoGenerate}
                                    className={`w-full ${autoGenerate ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`}
                                />
                                {errors.domain && <p className="text-sm text-red-500">{errors.domain}</p>}
                                <p className="text-xs text-muted-foreground">El dominio debe ser único y será el punto de acceso principal.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de información del administrador */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <User className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Usuario Administrador</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="admin_name" className="text-sm font-medium">
                                    Nombre <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_name"
                                    name="admin_name"
                                    value={formData.admin_name}
                                    onChange={handleChange}
                                    placeholder="Nombre del administrador"
                                    disabled={isSubmitting}
                                    className="w-full"
                                />
                                {errors.admin_name && <p className="text-sm text-red-500">{errors.admin_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_email" className="text-sm font-medium">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="admin_email"
                                    name="admin_email"
                                    type="email"
                                    value={formData.admin_email}
                                    onChange={handleChange}
                                    placeholder={`admin@${domain}`}
                                    disabled={isSubmitting}
                                    className="w-full"
                                />
                                {errors.admin_email && <p className="text-sm text-red-500">{errors.admin_email}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admin_password" className="text-sm font-medium">
                                Contraseña <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="admin_password"
                                name="admin_password"
                                type="password"
                                value={formData.admin_password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                disabled={isSubmitting}
                                className="w-full"
                            />
                            {errors.admin_password && <p className="text-sm text-red-500">{errors.admin_password}</p>}
                            <p className="text-xs text-muted-foreground">
                                Mínimo 8 caracteres. El administrador podrá crear otros usuarios con diferentes roles.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Al crear un inquilino, se generará automáticamente un usuario administrador que podrá gestionar la empresa y crear otros
                        usuarios con roles como vendedores, cajeros y contadores.
                    </p>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear Inquilino'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
