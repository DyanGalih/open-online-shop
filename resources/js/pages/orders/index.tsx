import { Link, Head } from '@inertiajs/react';
import { Clock, CheckCircle } from 'lucide-react';
import React from 'react';
import { formatCurrency } from '@/lib/currency';

export default function Index({ orders }: { orders: any[] }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                        <CheckCircle className="mr-1 h-3 w-3" /> Paid
                    </span>
                );
            case 'pending':
            case 'awaiting_payment':
                return (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                        <Clock className="mr-1 h-3 w-3" /> Awaiting Payment
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 font-sans text-foreground">
            <Head title="Order History" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-baseline justify-between border-b border-border pb-5">
                    <div>
                        <h1 className="font-serif text-3xl text-foreground">
                            Order History
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and view your past orders.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="text-xs font-semibold tracking-wider text-primary uppercase hover:underline"
                    >
                        Continue Shopping →
                    </Link>
                </div>

                <div className="overflow-hidden border border-border bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-border bg-slate-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                {orders.map((order: any) => (
                                    <tr
                                        key={order.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-foreground">
                                            #{order.id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground uppercase">
                                            {order.paymentMethod?.replace(
                                                '_',
                                                ' ',
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-foreground">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-xs font-semibold text-primary hover:underline"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-sm text-muted-foreground"
                                        >
                                            You haven't placed any orders yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
