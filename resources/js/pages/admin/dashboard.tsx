import React from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ metrics }) {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Daily Sales</h3>
                    <p style={{ fontSize: '24px' }}>${metrics.dailySales}</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Pending/Awaiting Orders</h3>
                    <p style={{ fontSize: '24px' }}>{metrics.pendingOrders}</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Low Stock Products</h3>
                    <p style={{ fontSize: '24px' }}>{metrics.lowStockProducts}</p>
                </div>
            </div>
            
            <div style={{ marginTop: '40px' }}>
                <Link href="/admin/orders" style={{ padding: '10px 20px', background: '#333', color: 'white', textDecoration: 'none' }}>
                    Manage Orders
                </Link>
            </div>
        </div>
    );
}
