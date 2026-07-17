import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Checkout({ cartItems, total, requiresShipping }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        shipping_address: '',
        payment_method: 'midtrans',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout/process');
    };

    return (
        <div>
            <h1>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h2>Order Summary</h2>
                    <ul>
                        {cartItems.map((item: any) => (
                            <li key={item.id}>
                                {item.name} x {item.quantity} - ${item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${total}</h3>
                </div>
                <div>
                    <h2>Payment & Details</h2>
                    <form onSubmit={submit}>
                        <div>
                            <label>Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <div>{errors.name}</div>}
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <div>{errors.email}</div>}
                        </div>
                        {requiresShipping && (
                            <div>
                                <label>Shipping Address</label>
                                <textarea value={data.shipping_address} onChange={e => setData('shipping_address', e.target.value)} required></textarea>
                                {errors.shipping_address && <div>{errors.shipping_address}</div>}
                            </div>
                        )}
                        <div>
                            <label>Payment Method</label>
                            <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
                                <option value="midtrans">Midtrans (Auto-verify)</option>
                                <option value="manual">Manual Bank Transfer</option>
                            </select>
                            {errors.payment_method && <div>{errors.payment_method}</div>}
                        </div>
                        <button type="submit" disabled={processing} style={{ marginTop: '10px' }}>Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
