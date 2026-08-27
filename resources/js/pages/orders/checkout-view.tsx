import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    ShoppingBag,
    ArrowRight,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import type { CheckoutOrderViewType } from '@/types/order-checkout-view';

export default function CheckoutView({ order }: { order: CheckoutOrderViewType }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        <CheckCircle className="mr-1 h-3.5 w-3.5" /> Paid
                    </span>
                );
            case 'pending':
            case 'awaiting_payment':
                return (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        <Clock className="mr-1 h-3.5 w-3.5" /> Awaiting Payment
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 font-sans text-foreground">
            <Head title={`Order #${order.id.substring(0, 8)}`} />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Sign-in Promotion Callout */}
                <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Viewing single-session order snapshot
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Sign in to access your full invoice history, track shipments, and download purchased files.
                        </p>
                    </div>
                    <Link href="/login">
                        <Button size="sm" variant="default" className="shrink-0 text-xs">
                            Sign in to view all orders <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>

                <div className="border border-border bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col justify-between border-b border-border pb-6 md:flex-row md:items-center">
                        <div>
                            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                Order Confirmation
                            </span>
                            <h1 className="mt-1 font-serif text-2xl text-foreground md:text-3xl">
                                Order #{order.id.substring(0, 8)}
                            </h1>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {getStatusBadge(order.status)}
                        </div>
                    </div>

                    <div className="mt-6 border-b border-border pb-6">
                        <h3 className="mb-4 font-serif text-lg text-foreground">
                            Order Items
                        </h3>
                        <div className="divide-y divide-border">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between py-4 sm:flex-row sm:items-start"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-foreground">
                                            {item.name}
                                        </h4>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-foreground">
                                            {formatCurrency(item.price)} each
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-end sm:mt-0">
                                        <span className="text-sm font-semibold text-foreground">
                                            {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="mb-3 font-serif text-lg text-foreground">
                                Summary
                            </h3>
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Payment Method:</span>
                                    <span className="font-medium text-foreground uppercase">
                                        {order.paymentMethod?.replace('_', ' ') || 'Manual'}
                                    </span>
                                </div>
                                {order.shippingAddress && (
                                    <div className="pt-2">
                                        <span className="mb-0.5 block text-muted-foreground">
                                            Shipping Address:
                                        </span>
                                        <p className="border border-border bg-slate-50 p-3 text-xs leading-relaxed text-foreground">
                                            {order.shippingAddress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-end border border-border bg-slate-50/50 p-6">
                            <div className="flex justify-between text-base font-semibold text-foreground">
                                <span>Total Amount:</span>
                                <span>
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
