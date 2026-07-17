import { Drawer, Input, Button, Grid } from 'antd';
import { ShoppingBag, Trash2, Minus, Plus, Gift } from 'lucide-react';
import React from 'react';

export interface CartItem {
    id: string; // unique cart item key
    productId?: number; // for standard items
    title: string;
    price: number;
    quantity: number;
    image_url?: string | null;
    type: 'standard' | 'gift-box';
    // For Gift Boxes:
    boxStyle?: string;
    items?: Array<{ id: number; title: string; price: number }>;
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

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 5.0;
    const finalTotal = subtotal + shipping;

    const getProductImage = (title: string) => {
        if (title.toLowerCase().includes('mug')) {
            return 'https://placehold.co/600x800/eae3df/a3928f?text=Ceramic+Mug';
        } else if (title.toLowerCase().includes('candle')) {
            return 'https://placehold.co/600x800/e6e1d9/a3928f?text=Soy+Candle';
        } else if (title.toLowerCase().includes('tote')) {
            return 'https://placehold.co/600x800/e8ece6/a3928f?text=Tote+Bag';
        } else if (title.toLowerCase().includes('watch')) {
            return 'https://placehold.co/600x800/f3e8e6/a3928f?text=Watch';
        }

        return 'https://placehold.co/100x100/eaeaea/a3928f?text=Item';
    };

    return (
        <Drawer
            title={
                <div className="flex flex-col font-sans">
                    {isMobile && (
                        <div className="mx-auto mb-4 h-1 w-10 rounded bg-gray-300" />
                    )}
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag className="h-5 w-5 text-[#859b84]" />
                        <span className="font-serif text-lg text-[#333333]">
                            Shopping Bag
                        </span>
                        <span className="ml-1 rounded-full bg-[#e6b3b3] px-2 py-0.5 text-xs font-bold text-white">
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
                <div className="border-t border-[#eaeaea] bg-[#fbf9f6] p-6 font-sans">
                    <div className="mb-6 flex gap-2.5">
                        <Input
                            placeholder="PROMO CODE"
                            className="rounded-none! border-[#eaeaea]! text-xs font-semibold"
                        />
                        <Button
                            style={{
                                background: '#333333',
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

                    <div className="mb-6 flex flex-col gap-3 text-sm text-[#666666]">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium text-[#333333]">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            {shipping === 0 ? (
                                <span className="text-xs font-medium tracking-wider text-[#859b84] uppercase">
                                    FREE
                                </span>
                            ) : (
                                <span className="font-medium text-[#333333]">
                                    ${shipping.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="my-4 border-t border-[#eaeaea]" />

                    <div className="mb-6 flex items-center justify-between">
                        <span className="font-serif text-base text-[#333333]">
                            Total Price:
                        </span>
                        <span className="font-serif text-xl font-bold text-[#333333]">
                            ${finalTotal.toFixed(2)}
                        </span>
                    </div>

                    <Button
                        block
                        style={{
                            background: '#859b84',
                            color: '#fff',
                            height: 50,
                            borderRadius: 0,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            border: 'none',
                            letterSpacing: '0.05em',
                        }}
                        className="tracking-wider uppercase"
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            }
        >
            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 border border-[#eaeaea] bg-white p-4 transition-shadow hover:shadow-sm"
                    >
                        {/* Image Container */}
                        <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center overflow-hidden border border-[#eaeaea] bg-[#f9f9f9]">
                            {item.type === 'gift-box' ? (
                                <div className="flex h-full w-full items-center justify-center bg-[#fdf5f2] text-[#d89797]">
                                    <Gift className="h-8 w-8" />
                                </div>
                            ) : (
                                <img
                                    src={getProductImage(item.title)}
                                    alt={item.title}
                                    className="h-full w-full object-cover object-center"
                                />
                            )}
                        </div>

                        {/* Details Area */}
                        <div className="flex-grow">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="margin-0 font-serif text-sm leading-tight text-[#333333] md:text-base">
                                        {item.title}
                                    </h4>

                                    {item.type === 'gift-box' ? (
                                        <div className="mt-1.5 space-y-1">
                                            <span className="block text-[10px] font-semibold tracking-wider text-[#859b84] uppercase">
                                                Custom Gift Box
                                            </span>
                                            <p className="text-[11px] leading-snug text-[#666666]">
                                                <strong>Items:</strong>{' '}
                                                {item.items
                                                    ?.map((i) => i.title)
                                                    .join(', ')}
                                            </p>
                                            {item.cardMessage?.trim() && (
                                                <p className="text-[11px] leading-snug text-[#666666] italic">
                                                    <strong>Card:</strong> "
                                                    {item.cardMessage}"
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="mt-1 block text-[11px] tracking-wider text-[#999999] uppercase">
                                            Standard Item
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-1 text-gray-400 transition-colors hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Quantity and Price row */}
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#333333]">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>

                                <div className="flex items-center gap-3.5 rounded-none border border-[#eaeaea] bg-[#fbf9f6]/30 px-2.5 py-1">
                                    <button
                                        onClick={() =>
                                            onUpdateQuantity(item.id, -1)
                                        }
                                        className="background-none flex cursor-pointer items-center border-none text-gray-400 transition-colors hover:text-[#333333]"
                                    >
                                        <Minus size={11} />
                                    </button>
                                    <span className="min-w-4 text-center text-xs font-semibold text-[#333333]">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            onUpdateQuantity(item.id, 1)
                                        }
                                        className="background-none flex cursor-pointer items-center border-none text-gray-400 transition-colors hover:text-[#333333]"
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
                        <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                        <p className="text-sm text-[#666666]">
                            Your shopping bag is empty.
                        </p>
                        <button
                            onClick={onClose}
                            className="mx-auto mt-3 block text-xs font-semibold tracking-wider text-[#859b84] uppercase transition-colors hover:text-[#728871]"
                        >
                            Continue Shopping →
                        </button>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
