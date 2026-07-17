import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <div>
            <h1>Create Category</h1>
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
                <button type="submit" disabled={processing}>Save</button>
            </form>
        </div>
    );
}
