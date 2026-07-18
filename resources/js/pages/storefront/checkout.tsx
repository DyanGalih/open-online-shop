import { useForm, Head } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

export default function Checkout({
    cartItems,
    total,
    requiresShipping,
}: {
    cartItems: any[];
    total: number;
    requiresShipping: boolean;
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        shippingAddress: '',
        paymentMethod: 'midtrans',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout/process', {
            onSuccess: () => {
                localStorage.removeItem('online_shop_cart');
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 font-sans text-foreground">
            <Head title="Checkout" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl text-foreground md:text-4xl">
                        Checkout
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Complete your order details below.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Left Column: Form Details */}
                    <div className="space-y-6 lg:col-span-3">
                        <div className="border border-border bg-white p-6 shadow-sm md:p-8">
                            <h2 className="mb-6 border-b border-border pb-3 font-serif text-xl text-foreground">
                                Payment & Delivery Details
                            </h2>
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-foreground uppercase">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-none border border-border bg-background p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="mt-1.5 text-xs text-destructive">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-foreground uppercase">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-none border border-border bg-background p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                        required
                                    />
                                    {errors.email && (
                                        <div className="mt-1.5 text-xs text-destructive">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {requiresShipping && (
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold tracking-wider text-foreground uppercase">
                                            Shipping Address
                                        </label>
                                        <textarea
                                            value={data.shippingAddress}
                                            onChange={(e) =>
                                                setData(
                                                    'shippingAddress',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full resize-none rounded-none border border-border bg-background p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                            rows={4}
                                            required
                                        />
                                        {errors.shippingAddress && (
                                            <div className="mt-1.5 text-xs text-destructive">
                                                {errors.shippingAddress}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-foreground uppercase">
                                        Payment Method
                                    </label>
                                    <select
                                        value={data.paymentMethod}
                                        onChange={(e) =>
                                            setData(
                                                'paymentMethod',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-none border border-border bg-background p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                    >
                                        <option value="midtrans">
                                            Midtrans (Auto-verify)
                                        </option>
                                        <option value="manual">
                                            Manual Bank Transfer
                                        </option>
                                    </select>
                                    {errors.paymentMethod && (
                                        <div className="mt-1.5 text-xs text-destructive">
                                            {errors.paymentMethod}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-none py-6 text-sm font-semibold tracking-wider uppercase"
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Place Order'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-6 border border-border bg-slate-50 p-6 md:p-8">
                            <h2 className="mb-6 border-b border-border pb-3 font-serif text-xl text-foreground">
                                Order Summary
                            </h2>
                            <div className="divide-y divide-border/60">
                                {cartItems.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between py-3 text-sm"
                                    >
                                        <div className="pr-4">
                                            <span className="font-medium text-foreground">
                                                {item.name}
                                            </span>
                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                        <span className="shrink-0 font-semibold text-foreground">
                                            {formatCurrency(
                                                item.price * item.quantity,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
                                <span className="font-serif text-lg text-foreground">
                                    Total Amount:
                                </span>
                                <span className="font-serif text-2xl font-bold text-foreground">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
