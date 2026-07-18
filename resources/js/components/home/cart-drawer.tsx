import { router } from '@inertiajs/react';
import { Button, Drawer, Grid, Input } from 'antd';
import { Gift, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import productPlaceholder from '@/../../resources/images/home/product-placeholder.svg';
import { formatCurrency } from '@/lib/currency';

export interface CartItem {
    id: string; // unique cart item key
    productId?: string; // for standard items
    name: string;
    price: number;
    quantity: number;
    image_url?: string | null;
    type: 'standard' | 'gift-box';
    // For Gift Boxes:
    boxStyle?: string;
    items?: Array<{ id: number; name: string; price: number }>;
    cardMessage?: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
}

const { useBreakpoint } = Grid;

export default function CartDrawer({
    isOpen,
    onClose,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
}: CartDrawerProps) {
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        const standardItems = cartItems
            .filter((item) => item.type === 'standard' && item.productId)
            .map((item) => ({
                productId: item.productId!,
                quantity: item.quantity,
            }));

        if (standardItems.length === 0) {
            return;
        }

        setCheckingOut(true);

        try {
            const csrfToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content ?? '';
            const response = await fetch('/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ items: standardItems }),
            });

            if (response.ok) {
                router.visit('/checkout');
            } else {
                console.error('Cart sync failed:', await response.text());
                setCheckingOut(false);
            }
        } catch (e) {
            console.error('Cart sync error:', e);
            setCheckingOut(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 5.0;
    const finalTotal = subtotal + shipping;

    const getProductImage = () => {
        return productPlaceholder;
    };

    return (
        <Drawer
            title={
                <div className="flex flex-col font-sans">
                    {isMobile && (
                        <div className="mx-auto mb-4 h-1 w-10 rounded bg-gray-300" />
                    )}
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <span className="font-serif text-lg text-foreground">
                            Shopping Bag
                        </span>
                        <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                            {cartItems.reduce(
                                (sum, item) => sum + item.quantity,
                                0,
                            )}
                        </span>
                    </div>
                </div>
            }
            placement={isMobile ? 'bottom' : 'right'}
            onClose={onClose}
            open={isOpen}
            closeIcon={
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
                    <span className="text-xl font-bold text-[#999999]">
                        &times;
                    </span>
                </div>
            }
            styles={{
                wrapper: {
                    width: isMobile ? '100%' : 450,
                    height: isMobile ? '85vh' : '100%',
                    ...(isMobile
                        ? { borderRadius: '24px 24px 0 0', overflow: 'hidden' }
                        : {}),
                },
                body: { padding: '24px', fontFamily: '"Inter", sans-serif' },
                footer: { padding: 0, borderTop: 'none' },
            }}
            footer={
                <div className="border-t border-border bg-background p-6 font-sans">
                    <div className="mb-6 flex gap-2.5">
                        <Input
                            placeholder="PROMO CODE"
                            className="rounded-none! border-border! text-xs font-semibold"
                        />
                        <Button
                            style={{
                                background: 'var(--foreground)',
                                color: '#fff',
                                borderRadius: 0,
                                height: 42,
                                padding: '0 20px',
                                fontWeight: 600,
                                border: 'none',
                            }}
                            className="text-xs tracking-wider uppercase"
                        >
                            Apply
                        </Button>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium text-foreground">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            {shipping === 0 ? (
                                <span className="text-xs font-medium tracking-wider text-primary uppercase">
                                    FREE
                                </span>
                            ) : (
                                <span className="font-medium text-foreground">
                                    {formatCurrency(shipping)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="my-4 border-t border-border" />

                    <div className="mb-6 flex items-center justify-between">
                        <span className="font-serif text-base text-foreground">
                            Total Price:
                        </span>
                        <span className="font-serif text-xl font-bold text-foreground">
                            {formatCurrency(finalTotal)}
                        </span>
                    </div>

                    <Button
                        block
                        onClick={handleCheckout}
                        disabled={checkingOut || cartItems.length === 0}
                        style={{
                            background: 'var(--primary)',
                            color: '#fff',
                            height: 50,
                            borderRadius: 'var(--radius)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            border: 'none',
                            letterSpacing: '0.05em',
                            opacity:
                                checkingOut || cartItems.length === 0 ? 0.7 : 1,
                        }}
                        className="tracking-wider uppercase"
                    >
                        {checkingOut ? 'Redirecting...' : 'Proceed to Checkout'}
                    </Button>
                </div>
            }
        >
            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 border border-border bg-white p-4 transition-shadow hover:shadow-sm"
                    >
                        {/* Image Container */}
                        <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/30">
                            {item.type === 'gift-box' ? (
                                <div className="flex h-full w-full items-center justify-center bg-accent/10 text-accent">
                                    <Gift className="h-8 w-8" />
                                </div>
                            ) : (
                                <img
                                    src={getProductImage()}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            )}
                        </div>

                        {/* Details Area */}
                        <div className="flex-grow">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="margin-0 font-serif text-sm leading-tight text-foreground md:text-base">
                                        {item.name}
                                    </h4>

                                    {item.type === 'gift-box' ? (
                                        <div className="mt-1.5 space-y-1">
                                            <span className="block text-[10px] font-semibold tracking-wider text-primary uppercase">
                                                Custom Gift Box
                                            </span>
                                            <p className="text-[11px] leading-snug text-muted-foreground">
                                                <strong>Items:</strong>{' '}
                                                {item.items
                                                    ?.map((i) => i.name)
                                                    .join(', ')}
                                            </p>
                                            {item.cardMessage?.trim() && (
                                                <p className="text-[11px] leading-snug text-muted-foreground italic">
                                                    <strong>Card:</strong> "
                                                    {item.cardMessage}"
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="mt-1 block text-[11px] tracking-wider text-muted-foreground uppercase">
                                            Standard Item
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Quantity and Price row */}
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>

                                <div className="flex items-center gap-3.5 rounded-none border border-border bg-background/30 px-2.5 py-1">
                                    <button
                                        onClick={() =>
                                            onUpdateQuantity(item.id, -1)
                                        }
                                        className="background-none flex cursor-pointer items-center border-none text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Minus size={11} />
                                    </button>
                                    <span className="min-w-4 text-center text-xs font-semibold text-foreground">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            onUpdateQuantity(item.id, 1)
                                        }
                                        className="background-none flex cursor-pointer items-center border-none text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Plus size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {cartItems.length === 0 && (
                    <div className="py-16 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">
                            Your shopping bag is empty.
                        </p>
                        <button
                            onClick={onClose}
                            className="mx-auto mt-3 block text-xs font-semibold tracking-wider text-primary uppercase transition-colors hover:text-primary/80"
                        >
                            Continue Shopping →
                        </button>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
