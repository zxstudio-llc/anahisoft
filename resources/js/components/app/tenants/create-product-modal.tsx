import { ProductModalProps } from '@/common/interfaces/tenant/products.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductFormData {
    code: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    stock: number;
    unit_type: string;
    currency: string;
    igv_type: string;
    igv_percentage: number;
    has_igv: boolean;
    category_id: string;
    brand: string;
    model: string;
    barcode: string;
    is_active: boolean;
    [key: string]: any; // Signatura de índice para el tipo string
}

export default function ProductModal({ isOpen, onClose, categories, unitTypes, igvTypes, currencies, product }: ProductModalProps) {
    const isEditMode = !!product;

    const { data, setData, post, put, processing, errors, reset } = useForm<ProductFormData>({
        code: '',
        name: '',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        unit_type: 'NIU', // Unidad por defecto
        currency: 'PEN', // Soles por defecto
        igv_type: '10', // Gravado por defecto
        igv_percentage: 18.00, // 18% por defecto
        has_igv: true, // Incluye IGV por defecto
        category_id: '',
        brand: '',
        model: '',
        barcode: '',
        is_active: true,
    });

    // Actualizar los datos del formulario cuando cambia el producto
    useEffect(() => {
        if (product) {
            setData({
                code: product.code || '',
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                cost: product.cost || 0,
                stock: product.stock || 0,
                unit_type: product.unit_type || 'NIU',
                currency: product.currency || 'PEN',
                igv_type: product.igv_type || '10',
                igv_percentage: product.igv_percentage || 18.00,
                has_igv: product.has_igv !== undefined ? product.has_igv : true,
                category_id: product.category_id ? String(product.category_id) : '',
                brand: product.brand || '',
                model: product.model || '',
                barcode: product.barcode || '',
                is_active: product.is_active !== undefined ? product.is_active : true,
            });
        } else {
            reset();
            setData({
                code: '',
                name: '',
                description: '',
                price: 0,
                cost: 0,
                stock: 0,
                unit_type: 'NIU',
                currency: 'PEN',
                igv_type: '10',
                igv_percentage: 18.00,
                has_igv: true,
                category_id: '',
                brand: '',
                model: '',
                barcode: '',
                is_active: true,
            });
        }
    }, [product, isOpen]);

    // Cálculos de IGV
    const [priceWithoutIgv, setPriceWithoutIgv] = useState(0);
    const [igvAmount, setIgvAmount] = useState(0);
    const [priceWithIgv, setPriceWithIgv] = useState(0);

    // Recalcular los valores de IGV cuando cambian los datos relevantes
    useEffect(() => {
        if (data.has_igv) {
            // Si el precio incluye IGV, calculamos el precio sin IGV
            const priceWithIgv = parseFloat(String(data.price));
            const priceWithoutIgv = priceWithIgv / (1 + (data.igv_percentage / 100));
            const igvAmount = priceWithIgv - priceWithoutIgv;
            
            setPriceWithoutIgv(parseFloat(priceWithoutIgv.toFixed(2)));
            setIgvAmount(parseFloat(igvAmount.toFixed(2)));
            setPriceWithIgv(priceWithIgv);
        } else {
            // Si el precio no incluye IGV, calculamos el precio con IGV
            const priceWithoutIgv = parseFloat(String(data.price));
            const igvAmount = priceWithoutIgv * (data.igv_percentage / 100);
            const priceWithIgv = priceWithoutIgv + igvAmount;
            
            setPriceWithoutIgv(priceWithoutIgv);
            setIgvAmount(parseFloat(igvAmount.toFixed(2)));
            setPriceWithIgv(parseFloat(priceWithIgv.toFixed(2)));
        }
    }, [data.price, data.igv_percentage, data.has_igv]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && product) {
            put(`/products/${product.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/products', {
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

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('price', parseFloat(e.target.value) || 0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Actualice los datos del producto para la facturación electrónica.'
                            : 'Ingrese los datos del producto para la facturación electrónica.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Código */}
                            <div>
                                <Label htmlFor="code">
                                    Código <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="Código interno"
                                    required
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>
                            
                            {/* Código de barras */}
                            <div>
                                <Label htmlFor="barcode">Código de barras</Label>
                                <Input
                                    id="barcode"
                                    value={data.barcode}
                                    onChange={(e) => setData('barcode', e.target.value)}
                                    placeholder="Código de barras (opcional)"
                                />
                                {errors.barcode && <p className="text-sm text-red-500">{errors.barcode}</p>}
                            </div>
                        </div>

                        {/* Nombre */}
                        <div>
                            <Label htmlFor="name">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nombre del producto"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Descripción */}
                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <textarea
                                id="description"
                                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción detallada del producto"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Categoría */}
                            <div>
                                <Label htmlFor="category_id">Categoría</Label>
                                <select
                                    id="category_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                            </div>
                            
                            {/* Unidad de medida */}
                            <div>
                                <Label htmlFor="unit_type">
                                    Unidad de medida <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="unit_type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={data.unit_type}
                                    onChange={(e) => setData('unit_type', e.target.value)}
                                    required
                                >
                                    {unitTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.unit_type && <p className="text-sm text-red-500">{errors.unit_type}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Marca */}
                            <div>
                                <Label htmlFor="brand">Marca</Label>
                                <Input
                                    id="brand"
                                    value={data.brand}
                                    onChange={(e) => setData('brand', e.target.value)}
                                    placeholder="Marca (opcional)"
                                />
                                {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                            </div>
                            
                            {/* Modelo */}
                            <div>
                                <Label htmlFor="model">Modelo</Label>
                                <Input
                                    id="model"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    placeholder="Modelo (opcional)"
                                />
                                {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Stock */}
                            <div>
                                <Label htmlFor="stock">
                                    Stock <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                    required
                                />
                                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                            </div>
                            
                            {/* Costo */}
                            <div>
                                <Label htmlFor="cost">Costo</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                        {data.currency === 'PEN' ? 'S/' : '$'}
                                    </span>
                                    <Input
                                        id="cost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="pl-8"
                                        value={data.cost}
                                        onChange={(e) => setData('cost', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                {errors.cost && <p className="text-sm text-red-500">{errors.cost}</p>}
                            </div>
                        </div>

                        {/* Sección de precios e IGV */}
                        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                            <h3 className="mb-2 text-sm font-medium">Configuración de precios e impuestos</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {/* Moneda */}
                                <div>
                                    <Label htmlFor="currency">
                                        Moneda <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="currency"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                        required
                                    >
                                        {currencies.map((currency) => (
                                            <option key={currency.value} value={currency.value}>
                                                {currency.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
                                </div>
                                
                                {/* Tipo de IGV */}
                                <div>
                                    <Label htmlFor="igv_type">
                                        Tipo de IGV <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="igv_type"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={data.igv_type}
                                        onChange={(e) => setData('igv_type', e.target.value)}
                                        required
                                    >
                                        {igvTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.igv_type && <p className="text-sm text-red-500">{errors.igv_type}</p>}
                                </div>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* Porcentaje de IGV */}
                                <div>
                                    <Label htmlFor="igv_percentage">
                                        % IGV <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="igv_percentage"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.igv_percentage}
                                            onChange={(e) => setData('igv_percentage', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                            %
                                        </span>
                                    </div>
                                    {errors.igv_percentage && <p className="text-sm text-red-500">{errors.igv_percentage}</p>}
                                </div>
                                
                                {/* Precio */}
                                <div>
                                    <Label htmlFor="price">
                                        Precio {data.has_igv ? 'con IGV' : 'sin IGV'} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            {data.currency === 'PEN' ? 'S/' : '$'}
                                        </span>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8"
                                            value={data.price}
                                            onChange={handlePriceChange}
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>
                            </div>
                            
                            {/* Checkbox para incluir IGV */}
                            <div className="mt-4 flex items-center space-x-2">
                                <Checkbox
                                    id="has_igv"
                                    checked={data.has_igv}
                                    onCheckedChange={(checked) => setData('has_igv', !!checked)}
                                />
                                <Label htmlFor="has_igv" className="text-sm font-normal">
                                    El precio incluye IGV
                                </Label>
                            </div>
                            
                            {/* Resumen de cálculos */}
                            <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">Precio sin IGV:</span>
                                        <div className="font-medium">
                                            {data.currency === 'PEN' ? 'S/ ' : '$ '}
                                            {priceWithoutIgv.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">IGV ({data.igv_percentage}%):</span>
                                        <div className="font-medium">
                                            {data.currency === 'PEN' ? 'S/ ' : '$ '}
                                            {igvAmount.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Precio con IGV:</span>
                                        <div className="font-medium">
                                            {data.currency === 'PEN' ? 'S/ ' : '$ '}
                                            {priceWithIgv.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Estado (solo en modo edición) */}
                        {isEditMode && (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="text-sm font-normal">
                                    Producto activo
                                </Label>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 