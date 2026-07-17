import React from 'react';

export default function Index({ categories }) {
    return (
        <div>
            <h1>Categories</h1>
            <a href="/admin/categories/create">Create Category</a>
            <ul>
                {categories.map((cat: any) => (
                    <li key={cat.id}>
                        {cat.name} - <a href={`/admin/categories/${cat.id}/edit`}>Edit</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
