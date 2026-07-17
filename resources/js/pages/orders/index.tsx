import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ orders }) {
    return (
        <div>
            <h1>Order History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: any) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>${order.total_amount}</td>
                            <td>{order.status}</td>
                            <td>
                                <Link href={`/orders/${order.id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
