import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Show({ order }: { order: any }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/orders/${order.id}/upload-proof`);
    };

    return (
        <div>
            <h1>Order Details: {order.id}</h1>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>
            
            {order.shipping_address && (
                <div>
                    <h3>Shipping Address</h3>
                    <p>{order.shipping_address}</p>
                </div>
            )}

            <h3>Items</h3>
            <ul>
                {order.items.map((item: any) => (
                    <li key={item.id}>
                        {item.product_name} x {item.quantity} - ${item.price * item.quantity}
                        {order.status === 'paid' && item.product.is_digital && (
                            <a href={`/downloads/${order.id}/${item.product_id}`} style={{ marginLeft: '10px' }} download>
                                Download
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            {order.payment_method === 'manual' && order.status === 'pending' && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <h3>Upload Payment Proof</h3>
                    <p>Please transfer to Bank Account XXXX and upload your receipt below.</p>
                    <form onSubmit={submit}>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setData('payment_proof', e.target.files ? e.target.files[0] : null)} 
                            required 
                        />
                        {errors.payment_proof && <div>{errors.payment_proof}</div>}
                        <button type="submit" disabled={processing || !data.payment_proof} style={{ marginTop: '10px' }}>
                            Upload Proof
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
