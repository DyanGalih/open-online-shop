import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    return (
        <div>
            <h1>Edit Category</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <div>{errors.name}</div>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)}></textarea>
                    {errors.description && <div>{errors.description}</div>}
                </div>
                <button type="submit" disabled={processing}>Update</button>
            </form>
        </div>
    );
}
