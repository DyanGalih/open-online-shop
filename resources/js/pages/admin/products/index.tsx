import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription, 
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet';
import { Package, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency, formatNumberInput, parseNumberInput } from '@/lib/currency';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
];

export default function Index({ products, categories }: { products: any[]; categories: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [priceDisplay, setPriceDisplay] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: undefined as string | undefined,
        name: '',
        categoryId: '',
        description: '',
        price: 0,
        isDigital: false,
        stock: 0,
        status: 'draft',
        digital_file: null as File | null,
    });

    const handleCreateOpen = () => {
        clearErrors();
        setMode('create');
        setEditingProduct(null);
        reset();
        setPriceDisplay('');
        setIsOpen(true);
    };

    const handleEditOpen = (product: any) => {
        clearErrors();
        setMode('edit');
        setEditingProduct(product);
        setData({
            _method: 'PUT',
            name: product.name || '',
            categoryId: product.categoryId || '',
            description: product.description || '',
            price: product.price || 0,
            isDigital: product.isDigital || false,
            stock: product.stock || 0,
            status: product.status || 'draft',
            digital_file: null,
        });
        setPriceDisplay(formatNumberInput(String(product.price)));
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/products', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post(`/admin/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Products Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                    </div>
                    <Button onClick={handleCreateOpen}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Product
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Catalog Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No products found. Start by creating one.</p>
                            </div>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Product Name</th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {products.map((prod: any) => (
                                            <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4 font-medium">{prod.name}</td>
                                                <td className="px-4 py-4">{prod.category?.name || 'N/A'}</td>
                                                <td className="px-4 py-4 text-right">{formatCurrency(prod.price)}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditOpen(prod)}>Edit</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Slide-over Sheet (Drawer) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="right" className="sm:max-w-md flex flex-col h-full justify-between p-0">
                    <div className="overflow-y-auto flex-1">
                        <SheetHeader className="px-6 py-5 border-b border-gray-100">
                            <SheetTitle className="text-xl font-serif text-gray-900">
                                {mode === 'create' ? 'Create Product' : 'Edit Product'}
                            </SheetTitle>
                            <SheetDescription>
                                {mode === 'create' 
                                    ? 'Add a new product to your store catalog.' 
                                    : 'Modify the details of your catalog item.'}
                            </SheetDescription>
                        </SheetHeader>

                        <form onSubmit={submit} id="productForm" className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                                <Input 
                                    id="name"
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    placeholder="Enter product name"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Category <span className="text-destructive">*</span></Label>
                                <select 
                                    id="categoryId"
                                    value={data.categoryId} 
                                    onChange={e => setData('categoryId', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                                    <Input 
                                        id="price"
                                        type="text" 
                                        value={priceDisplay} 
                                        onChange={e => {
                                            const formatted = formatNumberInput(e.target.value);
                                            setPriceDisplay(formatted);
                                            setData('price', parseNumberInput(formatted));
                                        }} 
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity <span className="text-destructive">*</span></Label>
                                    <Input 
                                        id="stock"
                                        type="number" 
                                        value={data.stock} 
                                        onChange={e => setData('stock', Number(e.target.value))} 
                                        placeholder="0"
                                        disabled={data.isDigital}
                                        required={!data.isDigital}
                                    />
                                    {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea 
                                    id="description"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Write product description..."
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status"
                                    value={data.status} 
                                    onChange={e => setData('status', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                </select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <input 
                                        id="isDigital"
                                        type="checkbox"
                                        checked={data.isDigital}
                                        onChange={e => {
                                            const checked = e.target.checked;
                                            setData(data => ({
                                                ...data,
                                                isDigital: checked,
                                                stock: checked ? 0 : data.stock,
                                            }));
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-[#8B9B82] focus:ring-[#8B9B82]"
                                    />
                                    <Label htmlFor="isDigital">Digital Product</Label>
                                </div>
                                {errors.isDigital && <p className="text-sm text-destructive">{errors.isDigital}</p>}

                                {data.isDigital && (
                                    <div className="space-y-2 border p-3 rounded-lg bg-gray-50/50">
                                        <Label htmlFor="digital_file">
                                            Digital File {mode === 'edit' && <span className="text-xs text-muted-foreground">(Leave blank to keep existing)</span>}
                                        </Label>
                                        <Input 
                                            id="digital_file"
                                            type="file" 
                                            onChange={e => setData('digital_file', e.target.files ? e.target.files[0] : null as any)} 
                                        />
                                        {errors.digital_file && <p className="text-sm text-destructive">{errors.digital_file}</p>}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    <SheetFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-row items-center justify-between mt-auto">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" className="border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" form="productForm" disabled={processing} className="bg-[#8B9B82] hover:bg-[#7A8A71] text-white hover:text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                            {mode === 'create' ? 'Create Product' : 'Save Changes'}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
