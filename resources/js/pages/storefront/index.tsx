import { useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ products, categories, currentCategory }) {
    const { post, processing } = useForm({});

    const addToCart = (productId: string) => {
        post(`/cart/add?product_id=${productId}&quantity=1`);
    };

    return (
        <div>
            <h1>Online Shop</h1>
            <nav>
                <a href="/">All</a>
                {categories.map((cat: any) => (
                    <a key={cat.id} href={`/?category=${cat.slug}`} style={{ margin: '0 10px', fontWeight: currentCategory === cat.slug ? 'bold' : 'normal' }}>
                        {cat.name}
                    </a>
                ))}
            </nav>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                {products.map((prod: any) => (
                    <div key={prod.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <h2>{prod.name}</h2>
                        <p>{prod.description}</p>
                        <p>${prod.price}</p>
                        <button onClick={() => addToCart(prod.id)} disabled={processing}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
