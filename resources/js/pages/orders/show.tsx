import { useForm, Head, Link } from '@inertiajs/react';
import {
    Star,
    Upload,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

function ReviewForm({
    productId,
    existingReview,
}: {
    productId: string;
    existingReview?: any;
}) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        rating: existingReview ? existingReview.rating : 5,
        comment: existingReview ? existingReview.comment || '' : '',
    });
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(!!existingReview);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/products/${productId}/reviews`, {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted || wasSuccessful) {
        return (
            <div className="mt-3 flex items-center space-x-2 rounded-md border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                    <strong>Your Review:</strong> {data.rating} ★{' '}
                    {data.comment && ` - "${data.comment}"`}
                </span>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 max-w-md rounded-lg border border-border bg-muted/40 p-4 shadow-sm"
        >
            <h4 className="mb-2 text-xs font-semibold tracking-wider text-foreground uppercase">
                Review this product
            </h4>
            <div className="mb-3 flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => setData('rating', star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                        <Star
                            className={`h-5 w-5 transition-colors ${
                                (hover || data.rating) >= star
                                    ? 'fill-[#e8c07d] text-[#e8c07d]'
                                    : 'text-muted-foreground/40'
                            }`}
                        />
                    </button>
                ))}
            </div>
            <textarea
                value={data.comment}
                onChange={(e) => setData('comment', e.target.value)}
                placeholder="Share your experience with this product... (optional)"
                className="mb-3 w-full resize-none rounded-md border border-border bg-background p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                rows={3}
            />
            {(errors as any).product_id && (
                <div className="mb-2 text-[10px] text-destructive">
                    {(errors as any).product_id}
                </div>
            )}
            <Button
                type="submit"
                size="sm"
                disabled={processing}
                className="px-4 text-xs"
            >
                Submit Review
            </Button>
        </form>
    );
}

export default function Show({ order }: { order: any }) {
    const { data, setData, post, processing, errors } = useForm({
        paymentProof: null as File | null,
    });

    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const submitProof = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/orders/${order.id}/payment-proof`);
    };

    const toggleAccordion = (key: string) => {
        setActiveAccordion(activeAccordion === key ? null : key);
    };

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
            <Head title={`Order #${order.id}`} />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/orders"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                    </Link>
                </div>

                <div className="rounded-none border border-border bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col justify-between border-b border-border pb-6 md:flex-row md:items-center">
                        <div>
                            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                Order Details
                            </span>
                            <h1 className="mt-1 font-serif text-2xl text-foreground md:text-3xl">
                                Order #{order.id.substring(0, 8)}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Placed on{' '}
                                {new Date(
                                    order.created_at,
                                ).toLocaleDateString()}
                            </p>
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
                            {order.items.map((item: any) => {
                                const userReview =
                                    item.product.reviews &&
                                    item.product.reviews[0];

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col justify-between py-4 sm:flex-row sm:items-start"
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-foreground">
                                                {item.product_name}
                                            </h4>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-foreground">
                                                {formatCurrency(
                                                    item.price_at_purchase,
                                                )}{' '}
                                                each
                                            </p>

                                            {/* Reviews section for paid order products */}
                                            {order.status === 'paid' && (
                                                <ReviewForm
                                                    productId={item.product_id}
                                                    existingReview={userReview}
                                                />
                                            )}
                                        </div>
                                        <div className="mt-4 flex flex-col items-end sm:mt-0 sm:text-right">
                                            <span className="text-sm font-semibold text-foreground">
                                                {formatCurrency(
                                                    item.price_at_purchase *
                                                        item.quantity,
                                                )}
                                            </span>
                                            {order.status === 'paid' &&
                                                item.product.isDigital && (
                                                    <a
                                                        href={`/orders/${order.id}/download/${item.product_id}`}
                                                        className="mt-2 inline-flex items-center text-xs font-medium text-primary hover:underline"
                                                        download
                                                    >
                                                        <FileText className="mr-1 h-3.5 w-3.5" />{' '}
                                                        Download Product
                                                    </a>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
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
                                        {order.paymentMethod?.replace('_', ' ')}
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
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Manual Transfer Flow & Proof Upload */}
                    {order.paymentMethod === 'manual' &&
                        (order.status === 'pending' ||
                            order.status === 'awaiting_payment') && (
                            <div className="mt-8 border-t border-border pt-8">
                                <div className="rounded-none border border-amber-200/60 bg-amber-50/40 p-6">
                                    <h3 className="mb-3 flex items-center font-serif text-lg text-amber-900">
                                        <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />{' '}
                                        Complete Your Bank Transfer
                                    </h3>
                                    <p className="mb-6 text-sm text-amber-800/90">
                                        Please transfer the total amount of{' '}
                                        <strong>
                                            {formatCurrency(order.total_amount)}
                                        </strong>{' '}
                                        to one of our official bank accounts
                                        below, then upload your transaction
                                        receipt.
                                    </p>

                                    {/* Accordion instructions */}
                                    <div className="mb-8 space-y-3">
                                        {/* BCA */}
                                        <div className="border border-border bg-white shadow-sm">
                                            <button
                                                onClick={() =>
                                                    toggleAccordion('bca')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-slate-50 focus:outline-none"
                                            >
                                                <span>
                                                    Transfer via Bank BCA
                                                </span>
                                                {activeAccordion === 'bca' ? (
                                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>
                                            {activeAccordion === 'bca' && (
                                                <div className="space-y-2 border-t border-border/60 px-4 pt-1 pb-4 text-xs leading-relaxed text-muted-foreground">
                                                    <p>
                                                        <strong>
                                                            Account Number:
                                                        </strong>{' '}
                                                        872-098-1122
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Account Name:
                                                        </strong>{' '}
                                                        Dyan Galih Online Shop
                                                    </p>
                                                    <p className="mt-1 font-semibold text-foreground">
                                                        Instructions:
                                                    </p>
                                                    <ol className="list-inside list-decimal space-y-1">
                                                        <li>
                                                            Open BCA Mobile or
                                                            go to a BCA ATM.
                                                        </li>
                                                        <li>
                                                            Select Transfer{' '}
                                                            {`->`} Transfer to
                                                            BCA Account.
                                                        </li>
                                                        <li>
                                                            Enter Account Number
                                                            8720981122 and the
                                                            exact order amount.
                                                        </li>
                                                        <li>
                                                            Complete the
                                                            transfer and
                                                            save/screenshot the
                                                            receipt.
                                                        </li>
                                                    </ol>
                                                </div>
                                            )}
                                        </div>

                                        {/* BCA VA Mock */}
                                        <div className="border border-border bg-white shadow-sm">
                                            <button
                                                onClick={() =>
                                                    toggleAccordion('mandiri')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-slate-50 focus:outline-none"
                                            >
                                                <span>
                                                    Transfer via Bank Mandiri
                                                </span>
                                                {activeAccordion ===
                                                'mandiri' ? (
                                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>
                                            {activeAccordion === 'mandiri' && (
                                                <div className="space-y-2 border-t border-border/60 px-4 pt-1 pb-4 text-xs leading-relaxed text-muted-foreground">
                                                    <p>
                                                        <strong>
                                                            Account Number:
                                                        </strong>{' '}
                                                        132-00-1928-3344
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Account Name:
                                                        </strong>{' '}
                                                        Dyan Galih Online Shop
                                                    </p>
                                                    <p className="mt-1 font-semibold text-foreground">
                                                        Instructions:
                                                    </p>
                                                    <ol className="list-inside list-decimal space-y-1">
                                                        <li>
                                                            Log in to Livin by
                                                            Mandiri or use ATM
                                                            Mandiri.
                                                        </li>
                                                        <li>
                                                            Choose Transfer{' '}
                                                            {`->`} Transfer to
                                                            Bank Mandiri.
                                                        </li>
                                                        <li>
                                                            Enter Account Number
                                                            1320019283344 and
                                                            correct amount.
                                                        </li>
                                                        <li>
                                                            Authorize
                                                            transaction and
                                                            screenshot success
                                                            screen.
                                                        </li>
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form Receipt Upload */}
                                    <form
                                        onSubmit={submitProof}
                                        className="border-t border-amber-200/60 pt-6"
                                    >
                                        <label className="mb-2 block text-xs font-semibold tracking-wider text-foreground uppercase">
                                            Upload Transaction Slip / Receipt
                                        </label>
                                        <div className="mt-1 flex justify-center rounded-none border-2 border-dashed border-muted-foreground/30 bg-white px-6 pt-5 pb-6 transition-colors hover:border-primary/50">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                                <div className="flex justify-center text-sm text-muted-foreground">
                                                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                                                        <span>
                                                            Upload a file
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                setData(
                                                                    'paymentProof',
                                                                    e.target
                                                                        .files
                                                                        ? e
                                                                              .target
                                                                              .files[0]
                                                                        : null,
                                                                )
                                                            }
                                                            className="sr-only"
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-muted-foreground/70">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                                {data.paymentProof && (
                                                    <p className="mt-2 text-xs font-semibold text-emerald-600">
                                                        Selected:{' '}
                                                        {data.paymentProof.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {errors.paymentProof && (
                                            <div className="mt-2 text-xs text-destructive">
                                                {errors.paymentProof}
                                            </div>
                                        )}

                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    !data.paymentProof
                                                }
                                                className="px-6"
                                            >
                                                {processing
                                                    ? 'Uploading...'
                                                    : 'Submit Payment Evidence'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
