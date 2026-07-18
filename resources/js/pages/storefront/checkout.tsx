import { useForm, Head } from '@inertiajs/react';
import React from 'react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';

export default function Checkout({ cartItems, total, requiresShipping }: { cartItems: any[]; total: number; requiresShipping: boolean }) {
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
                    <h1 className="font-serif text-3xl md:text-4xl text-foreground">Checkout</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Complete your order details below.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white border border-border shadow-sm p-6 md:p-8">
                            <h2 className="font-serif text-xl mb-6 text-foreground border-b border-border pb-3">Payment & Delivery Details</h2>
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        className="w-full text-sm p-3 border border-border bg-background rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                                        required 
                                    />
                                    {errors.name && <div className="text-xs text-destructive mt-1.5">{errors.name}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                        className="w-full text-sm p-3 border border-border bg-background rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                                        required 
                                    />
                                    {errors.email && <div className="text-xs text-destructive mt-1.5">{errors.email}</div>}
                                </div>
                                
                                {requiresShipping && (
                                    <div>
                                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Shipping Address</label>
                                        <textarea 
                                            value={data.shippingAddress} 
                                            onChange={e => setData('shippingAddress', e.target.value)} 
                                            className="w-full text-sm p-3 border border-border bg-background rounded-none focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                            rows={4}
                                            required 
                                        />
                                        {errors.shippingAddress && <div className="text-xs text-destructive mt-1.5">{errors.shippingAddress}</div>}
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Payment Method</label>
                                    <select 
                                        value={data.paymentMethod} 
                                        onChange={e => setData('paymentMethod', e.target.value)}
                                        className="w-full text-sm p-3 border border-border bg-background rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="midtrans">Midtrans (Auto-verify)</option>
                                        <option value="manual">Manual Bank Transfer</option>
                                    </select>
                                    {errors.paymentMethod && <div className="text-xs text-destructive mt-1.5">{errors.paymentMethod}</div>}
                                </div>
                                
                                <div className="pt-4">
                                    <Button type="submit" disabled={processing} className="w-full py-6 text-sm uppercase tracking-wider font-semibold rounded-none">
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-50 border border-border p-6 md:p-8 sticky top-6">
                            <h2 className="font-serif text-xl mb-6 text-foreground border-b border-border pb-3">Order Summary</h2>
                            <div className="divide-y divide-border/60">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="py-3 flex justify-between text-sm">
                                        <div className="pr-4">
                                            <span className="font-medium text-foreground">{item.name}</span>
                                            <span className="text-xs text-muted-foreground block mt-0.5">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold text-foreground shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-border mt-6 pt-6 flex justify-between items-baseline">
                                <span className="font-serif text-lg text-foreground">Total Amount:</span>
                                <span className="font-serif text-2xl font-bold text-foreground">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
