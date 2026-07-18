import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

export default function Index({ orders }: { orders: any[] }) {
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'default';
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <>
            <Head title="Orders Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No orders found.</p>
                            </div>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3">Order ID</th>
                                            <th className="px-4 py-3">Customer</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-right">Total</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {orders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4 font-mono font-medium">{order.id}</td>
                                                <td className="px-4 py-4">{order.user?.name || 'Guest'}</td>
                                                <td className="px-4 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-4 text-right font-semibold">${order.total_amount}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <Badge variant={getStatusVariant(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Button variant="outline" size="sm">Manage</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
