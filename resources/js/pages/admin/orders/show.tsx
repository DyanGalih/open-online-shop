import { useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Show({ order, paymentProofUrl }) {
    const { post, processing } = useForm();

    const approve = () => {
        if (confirm('Are you sure you want to approve this order?')) {
            post(`/admin/orders/${order.id}/approve`);
        }
    };

    const reject = () => {
        if (confirm('Are you sure you want to reject this order?')) {
            post(`/admin/orders/${order.id}/reject`);
        }
    };

    return (
        <div>
            <Link href="/admin/orders">Back to Orders</Link>
            <h1>Manage Order: {order.id}</h1>
            <p><strong>Customer:</strong> {order.user.name} ({order.user.email})</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>
            
            {order.shippingAddress && (
                <div>
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress}</p>
                </div>
            )}

            <h3>Items</h3>
            <ul>
                {order.items.map((item: any) => (
                    <li key={item.id}>
                        {item.product_name} x {item.quantity} - ${item.price * item.quantity}
                    </li>
                ))}
            </ul>

            {order.paymentMethod === 'manual' && order.status === 'awaiting_verification' && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <h3>Manual Payment Verification</h3>
                    {paymentProofUrl ? (
                        <div>
                            <p>Payment Proof:</p>
                            <img src={paymentProofUrl} alt="Payment Proof" style={{ maxWidth: '400px' }} />
                        </div>
                    ) : (
                        <p>No proof uploaded yet.</p>
                    )}
                    
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={approve} disabled={processing} style={{ marginRight: '10px', background: 'green', color: 'white' }}>
                            Approve Payment
                        </button>
                        <button onClick={reject} disabled={processing} style={{ background: 'red', color: 'white' }}>
                            Reject Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
