import { ClientModalProps } from '@/common/interfaces/tenant/clients.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentValidationService } from '@/services/document-validation.service';
import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ClientModal({ isOpen, onClose, documentTypes, client }: ClientModalProps) {
    const isEditMode = !!client;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        document_type: '01', // DNI por defecto
        document_number: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        province: '',
        department: '',
        country: 'PE',
        ubigeo: '',
    });

    // Actualizar los datos del formulario cuando cambia el cliente
    useEffect(() => {
        if (client) {
            setData({
                name: client.name || '',
                document_type: client.document_type || '01',
                document_number: client.document_number || '',
                email: client.email || '',
                phone: client.phone || '',
                address: client.address || '',
                city: client.city || '',
                district: client.district || '',
                province: client.province || '',
                department: client.department || '',
                country: client.country || 'PE',
                ubigeo: client.ubigeo || '',
            });
        } else {
            reset();
            setData({
                name: '',
                document_type: '01',
                document_number: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                district: '',
                province: '',
                department: '',
                country: 'PE',
                ubigeo: '',
            });
        }
    }, [client, isOpen]);

    const [validatingDocument, setValidatingDocument] = useState(false);
    const [documentValidated, setDocumentValidated] = useState(isEditMode); // Si estamos editando, consideramos el documento como ya validado
    const [validationMessage, setValidationMessage] = useState('');

    const validateDocument = async () => {
        if (!data.document_number || !data.document_type) {
            setValidationMessage('Ingrese un número de documento válido');
            return;
        }

        setValidatingDocument(true);
        setDocumentValidated(false);
        setValidationMessage('');

        try {
            // Usar el servicio de validación
            const response = await DocumentValidationService.validateDocument(data.document_type, data.document_number);

            if (response.success) {
                setDocumentValidated(true);
                setValidationMessage('Documento validado correctamente');

                // Autocompletar datos según el tipo de documento
                if (data.document_type === '01') {
                    // Para DNI, combinar nombres y apellidos
                    if (response.nombres && response.apellidoPaterno && response.apellidoMaterno) {
                        const fullName = `${response.apellidoPaterno} ${response.apellidoMaterno} ${response.nombres}`.trim();
                        setData('name', fullName);
                    }
                } else if (data.document_type === '06') {
                    // Para RUC
                    if (response.razonSocial) {
                        setData('name', response.razonSocial);

                        // Intentar obtener la dirección
                        let addressInfo = '';

                        if (response.direccion) {
                            addressInfo = response.direccion;
                        } else {
                            // Construir dirección a partir de componentes si están disponibles
                            const components = [response.direccion, response.distrito, response.provincia, response.departamento].filter(Boolean);

                            if (components.length > 0) {
                                addressInfo = components.join(', ');
                            }
                        }

                        if (addressInfo) {
                            setData('address', addressInfo);
                        }

                        // Si hay provincia, usarla como ciudad
                        if (response.provincia) {
                            setData('city', response.provincia);
                        } else if (response.departamento) {
                            setData('city', response.departamento);
                        }
                    }
                }
            } else {
                setDocumentValidated(false);
                setValidationMessage(response.message || 'No se pudo validar el documento');
            }
        } catch (error) {
            console.error('Error validando documento:', error);
            setValidationMessage('Error al validar el documento');
            setDocumentValidated(false);
        } finally {
            setValidatingDocument(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && client) {
            put(`/clients/${client.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/clients', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData('document_type', e.target.value);
        setDocumentValidated(false);
        setValidationMessage('');
    };

    const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('document_number', e.target.value);
        setDocumentValidated(false);
        setValidationMessage('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Actualice los datos del cliente para la facturación electrónica.'
                            : 'Ingrese los datos del cliente para la facturación electrónica.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="document_type" className="text-right">
                                Tipo Doc. <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="document_type"
                                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={data.document_type}
                                onChange={handleDocumentTypeChange}
                                required
                                disabled={isEditMode} // Deshabilitar en modo edición
                            >
                                {documentTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="document_number" className="text-right">
                                Nro. Doc. <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-2">
                                <Input
                                    id="document_number"
                                    value={data.document_number}
                                    onChange={handleDocumentNumberChange}
                                    placeholder={
                                        data.document_type === '01' ? '12345678' : data.document_type === '06' ? '20123456789' : 'Número de documento'
                                    }
                                    maxLength={data.document_type === '01' ? 8 : data.document_type === '06' ? 11 : 20}
                                    required
                                    disabled={isEditMode} // Deshabilitar en modo edición
                                />
                                {errors.document_number && <p className="text-sm text-red-500">{errors.document_number}</p>}
                            </div>
                            {!isEditMode && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={validateDocument}
                                    disabled={validatingDocument || !data.document_number}
                                >
                                    {validatingDocument ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Validar'}
                                </Button>
                            )}
                        </div>

                        {validationMessage && !isEditMode && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="col-span-3 col-start-2">
                                    <p className={`text-sm ${documentValidated ? 'text-green-500' : 'text-red-500'}`}>{validationMessage}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nombre completo o razón social"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Teléfono
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Número de teléfono"
                                />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Dirección
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Dirección completa"
                                />
                                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                                Ciudad
                            </Label>
                            <div className="col-span-3">
                                <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} placeholder="Ciudad" />
                                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="district" className="text-right">
                                Distrito
                            </Label>
                            <div className="col-span-3">
                                <Input id="district" value={data.district} onChange={(e) => setData('district', e.target.value)} placeholder="Distrito" />
                                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="province" className="text-right">
                                Provincia
                            </Label>
                            <div className="col-span-3">
                                <Input id="province" value={data.province} onChange={(e) => setData('province', e.target.value)} placeholder="Provincia" />
                                {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                                Departamento
                            </Label>
                            <div className="col-span-3">
                                <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} placeholder="Departamento" />
                                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="country" className="text-right">
                                País
                            </Label>
                            <div className="col-span-3">
                                <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} placeholder="País" />
                                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ubigeo" className="text-right">
                                Ubigeo
                            </Label>
                            <div className="col-span-3">
                                <Input id="ubigeo" value={data.ubigeo} onChange={(e) => setData('ubigeo', e.target.value)} placeholder="Ubigeo" />
                                {errors.ubigeo && <p className="text-sm text-red-500">{errors.ubigeo}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                (!isEditMode &&
                                    data.document_type !== '04' &&
                                    data.document_type !== '07' &&
                                    data.document_type !== '00' &&
                                    !documentValidated)
                            }
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isEditMode ? 'Actualizar Cliente' : 'Guardar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
