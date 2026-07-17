import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ product, categories }: { product: any, categories: any[] }) {
    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        name: product.name,
        category_id: product.category_id,
        description: product.description || '',
        price: product.price,
        is_digital: product.is_digital,
        stock: product.stock,
        status: product.status,
        digital_file: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`);
    };

    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Category</label>
                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Name</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} />
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)}></textarea>
                </div>
                <div>
                    <label>Price</label>
                    <input type="number" value={data.price} onChange={e => setData('price', Number(e.target.value))} />
                </div>
                <div>
                    <label>Stock</label>
                    <input type="number" value={data.stock} onChange={e => setData('stock', Number(e.target.value))} />
                </div>
                <div>
                    <label>Status</label>
                    <select value={data.status} onChange={e => setData('status', e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <div>
                    <label>Is Digital?</label>
                    <input type="checkbox" checked={data.is_digital} onChange={e => setData('is_digital', e.target.checked)} />
                </div>
                {data.is_digital && (
                    <div>
                        <label>Digital File (Leave blank to keep existing)</label>
                        <input type="file" onChange={e => setData('digital_file', e.target.files ? e.target.files[0] : null as any)} />
                    </div>
                )}
                <button type="submit" disabled={processing}>Update</button>
            </form>
        </div>
    );
}
