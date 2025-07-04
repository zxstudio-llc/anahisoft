import { CreateTenantFormData } from '@/common/interfaces/tenants.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, LoaderCircle, PlusCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Api from '@/lib/api';

interface ExtendedTenantFormData extends CreateTenantFormData {
    status?: string;
    condition?: string;
    address?: string;
    department?: string;
    province?: string;
    district?: string;
    registration_date?: string;
    trade_name?: string;
}

export function CreateTenantModal({ domain }: { domain: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ExtendedTenantFormData>({
        id: '',
        domain: '',
        company_name: '',
        ruc: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        status: '',
        condition: '',
        address: '',
        department: '',
        province: '',
        district: '',
        registration_date: '',
        trade_name: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoGenerate, setAutoGenerate] = useState(true);
    const [validatingRuc, setValidatingRuc] = useState(false);
    const [rucValidated, setRucValidated] = useState(false);

    // Generate ID and domain automatically from company name
    useEffect(() => {
        if (autoGenerate && formData.company_name) {
            const baseId = formData.company_name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            setFormData((prev) => ({
                ...prev,
                id: baseId,
                domain: `${baseId}.${domain}`,
            }));
        }
    }, [formData.company_name, autoGenerate, domain]);

    const validateRuc = async (ruc: string) => {
        if (ruc.length !== 10 && ruc.length !== 13) {
            setErrors((prev) => ({ ...prev, ruc: 'El RUC debe tener 10 o 13 dígitos' }));
            return;
        }
    
        setValidatingRuc(true);
        setErrors((prev) => ({ ...prev, ruc: '' }));
    
        try {
            const result = await Api.validateRuc(ruc);
            
            // Verificar estructura de respuesta y datos esenciales
            if (result?.data?.attributes) {
                const { attributes } = result.data;
                
                // Extraer datos del establecimiento principal si existe
                const mainEstablishment = attributes.establishment?.[0]?.[`establecimiento_0`] || {};
                
                setFormData((prev) => ({
                    ...prev,
                    company_name: attributes.business_name || attributes.legal_name || '',
                    trade_name: attributes.trade_name || attributes.commercial_name || '',
                    status: attributes.status || attributes.taxpayer_status || '',
                    condition: attributes.class || attributes.taxpayer_class || '',
                    address: attributes.head_office_address || mainEstablishment.ubicacion_establecimiento || '',
                    department: mainEstablishment.department || '',
                    province: mainEstablishment.province || '',
                    district: mainEstablishment.district || '',
                    registration_date: attributes.start_date || '',
                }));
    
                setRucValidated(true);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    ruc: 'No se encontraron datos válidos para el RUC proporcionado'
                }));
                setRucValidated(false);
            }
        } catch (error: any) {
            console.error('Error validating RUC:', error);
            setErrors((prev) => ({
                ...prev,
                ruc: error.message || 'Error al validar el RUC. Por favor intente nuevamente.'
            }));
            setRucValidated(false);
        } finally {
            setValidatingRuc(false);
        }
    };

    const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setFormData((prev) => ({
            ...prev,
            ruc: value,
        }));
        
        // Clear previous validation state and errors
        setRucValidated(false);
        setErrors((prev) => ({ ...prev, ruc: '' }));

        // Trigger validation when RUC is complete
        if (value.length === 10 || value.length === 13) {
            validateRuc(value);
        } else if (value.length > 0) {
            setErrors((prev) => ({
                ...prev,
                ruc: 'El RUC debe tener 10 o 13 dígitos'
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // If ID or domain is manually modified, disable auto-generation
        if ((name === 'id' || name === 'domain') && value !== '') {
            setAutoGenerate(false);
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post(route('admin.tenants.store'), {
            id: formData.id,
            domain: formData.domain,
            company_name: formData.company_name,
            ruc: formData.ruc,
            admin_name: formData.admin_name,
            admin_email: formData.admin_email,
            admin_password: formData.admin_password,
            status: formData.status,
            condition: formData.condition,
            address: formData.address,
            department: formData.department,
            province: formData.province,
            district: formData.district,
            registration_date: formData.registration_date,
            trade_name: formData.trade_name,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                resetForm();
            },
            onError: (errors) => {
                const formattedErrors: Record<string, string> = {};
                Object.keys(errors).forEach((key) => {
                    formattedErrors[key] = Array.isArray(errors[key]) 
                        ? errors[key][0] 
                        : errors[key];
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
            ruc: '',
            admin_name: '',
            admin_email: '',
            admin_password: '',
            // Additional fields
            status: '',
            condition: '',
            address: '',
            department: '',
            province: '',
            district: '',
            registration_date: '',
            trade_name: '',
        });
        setErrors({});
        setAutoGenerate(true);
        setRucValidated(false);
        setCurrentStep(1);
    };

    const renderStep1 = () => (
        <>
            <div className="flex items-center gap-2 border-b pb-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Información de la Empresa</h3>
            </div>

            <div className="space-y-2">
                <Label htmlFor="ruc" className="text-sm font-medium">
                    RUC <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="ruc"
                        name="ruc"
                        value={formData.ruc}
                        onChange={handleRucChange}
                        placeholder="Número de RUC"
                        disabled={isSubmitting || validatingRuc}
                        className={`w-full ${rucValidated ? 'border-green-500' : ''}`}
                        maxLength={13}
                        autoFocus
                    />
                    {validatingRuc && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                        </div>
                    )}
                </div>
                {errors.ruc && <p className="text-sm text-red-500">{errors.ruc}</p>}
                <p className="text-xs text-muted-foreground">Ingrese el RUC de la empresa para validar los datos automáticamente.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company_name" className="text-sm font-medium">
                    Razón Social <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Razón social de la empresa"
                    disabled={isSubmitting || validatingRuc || rucValidated}
                    className={`w-full ${rucValidated ? 'bg-green-50 dark:bg-green-950/10' : ''}`}
                />
                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                <p className="text-xs text-muted-foreground">El ID y dominio se generarán automáticamente a partir del nombre.</p>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="flex items-center gap-2 border-b pb-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Información Adicional</h3>
            </div>

            <div className="space-y-2">
                <Label htmlFor="trade_name" className="text-sm font-medium">Nombre Comercial</Label>
                <Input
                    id="trade_name"
                    name="trade_name"
                    value={formData.trade_name}
                    onChange={handleChange}
                    placeholder="Nombre comercial"
                    disabled={isSubmitting}
                    className="w-full"
                />
                {errors.trade_name && <p className="text-sm text-red-500">{errors.trade_name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
                    <Input
                        id="status"
                        name="status"
                        value={formData.status}
                        disabled
                        className="w-full bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="condition" className="text-sm font-medium">Condición</Label>
                    <Input
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        disabled
                        className="w-full bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Dirección</Label>
                <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    disabled
                    className="w-full bg-neutral-50 dark:bg-neutral-800"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Departamento</Label>
                    <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        disabled
                        className="w-full bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium">Provincia</Label>
                    <Input
                        id="province"
                        name="province"
                        value={formData.province}
                        disabled
                        className="w-full bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium">Distrito</Label>
                    <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        disabled
                        className="w-full bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
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
                        Correo <span className="text-red-500">*</span>
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
        </>
    );

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
                    <span>New Tenant</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Inquilino</DialogTitle>
                    <DialogDescription>Ingrese la información para crear un nuevo inquilino y su dominio asociado.</DialogDescription>
                </DialogHeader>

                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep === step 
                                        ? 'bg-indigo-600 text-white' 
                                        : currentStep > step 
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {currentStep > step ? '✓' : step}
                                </div>
                                <div className="text-xs mt-2">
                                    {step === 1 ? 'Empresa' : step === 2 ? 'Detalles' : 'Admin'}
                                </div>
                                {step < 3 && (
                                    <div className={`h-1 w-12 mx-2 ${
                                        currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    <DialogFooter>
                        <div className="flex justify-between gap-4 w-full">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={isSubmitting}
                                >
                                    Anterior
                                </Button>
                            )}
                            
                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={isSubmitting || validatingRuc || (currentStep === 1 && !rucValidated)}
                                    className="ml-auto"
                                >
                                    Siguiente
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-auto"
                                >
                                    {isSubmitting ? 'Creando...' : 'Crear Inquilino'}
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
