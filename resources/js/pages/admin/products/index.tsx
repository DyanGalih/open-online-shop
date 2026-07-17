import React from 'react';

export default function Index({ products }) {
    return (
        <div>
            <h1>Products</h1>
            <a href="/admin/products/create">Create Product</a>
            <ul>
                {products.map((prod: any) => (
                    <li key={prod.id}>
                        {prod.name} ({prod.price}) - <a href={`/admin/products/${prod.id}/edit`}>Edit</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
