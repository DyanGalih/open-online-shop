import { router } from '@inertiajs/react';
import { Button, Checkbox, Input, Radio, Tooltip, message } from 'antd';
import { Gift, Info } from 'lucide-react';
import { useState } from 'react';
import boxKraft from '@/../../resources/images/home/box-kraft.svg';
import boxSage from '@/../../resources/images/home/box-sage.svg';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    filePath: string | null;
}

interface CustomizerSectionProps {
    onAddGiftBoxToCart?: (giftBox: {
        boxStyle: string;
        items: Product[];
        cardMessage: string;
        totalPrice: number;
    }) => void;
}

export default function CustomizerSection({
    onAddGiftBoxToCart,
}: CustomizerSectionProps) {
    const boxStyles = [
        {
            key: 'kraft-box',
            name: 'Kraft Box (Classic)',
            price: 10.0,
            colorBg: '#ebe5e0',
            image: boxKraft,
        },
        {
            key: 'sage-ribbon-box',
            name: 'Sage Ribbon Box',
            price: 12.0,
            colorBg: 'var(--primary)',
            image: boxSage,
        },
    ];

    const availableItems: Product[] = [
        {
            id: 1,
            name: 'Minimal Ceramic Mug',
            slug: 'minimal-ceramic-mug',
            price: 18.0,
            filePath: null,
        },
        {
            id: 2,
            name: 'Scented Soy Candle',
            slug: 'scented-soy-candle',
            price: 22.0,
            filePath: null,
        },
        {
            id: 3,
            name: 'Canvas Everyday Tote',
            slug: 'canvas-everyday-tote',
            price: 34.0,
            filePath: null,
        },
        {
            id: 4,
            name: 'Classic Minimal Watch',
            slug: 'classic-minimal-watch',
            price: 49.0,
            filePath: null,
        },
    ];

    const [selectedBox, setSelectedBox] = useState('kraft-box');
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [cardMessage, setCardMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeBox =
        boxStyles.find((b) => b.key === selectedBox) || boxStyles[0];

    // Calculate prices (client side preview)
    const selectedItems = availableItems.filter((item) =>
        selectedItemIds.includes(item.id),
    );
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = activeBox.price + itemsTotal;

    const handleItemToggle = (id: number) => {
        setSelectedItemIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((itemId) => itemId !== id);
            }

            if (prev.length >= 5) {
                return prev;
            } // Limit max 5 items

            return [...prev, id];
        });
    };

    const handleAdd = () => {
        if (selectedItemIds.length < 3) {
            return;
        }

        setIsSubmitting(true);

        // Submit to server for authoritative pricing and validation
        router.post(
            '/gift-box',
            {
                boxStyle: selectedBox,
                selectedItems: selectedItemIds,
                cardMessage: cardMessage,
            },
            {
                onSuccess: () => {
                    onAddGiftBoxToCart?.({
                        boxStyle: activeBox.name,
                        items: selectedItems,
                        cardMessage,
                        totalPrice, // We still use client price for immediate UI, server validates
                    });

                    message.success('Gift box added to cart!');
                    setSelectedItemIds([]);
                    setCardMessage('');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    message.error(firstError as string);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const isAddDisabled = selectedItemIds.length < 3 || isSubmitting;

    return (
        <section
            id="customizer"
            className="w-full border-b border-border bg-background py-20 font-sans"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 font-serif text-3xl text-foreground md:text-4xl">
                        Custom Gift Box Builder
                    </h2>
                    <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
                        Design a bespoke gift package. Select a box style,
                        bundle 3 to 5 lifestyle items, and write a custom card
                        message.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Live Preview Column */}
                    <div className="flex min-h-[400px] flex-col items-center justify-center border border-border bg-white p-8">
                        <div className="relative mb-6 flex aspect-[4/3] w-full max-w-sm items-center justify-center overflow-hidden border border-border bg-muted/30">
                            <img
                                src={activeBox.image}
                                alt={activeBox.name}
                                className="h-full w-full object-cover object-center"
                            />
                            <div className="absolute bottom-3 left-3 border border-border bg-white/90 px-3 py-1 text-xs font-medium tracking-wider text-foreground uppercase backdrop-blur">
                                {activeBox.name}
                            </div>
                        </div>
                        <div className="w-full max-w-sm text-center">
                            <h4 className="mb-2 flex items-center justify-center gap-2 font-serif text-lg text-foreground">
                                <Gift className="h-4 w-4 text-primary" /> Gift
                                Box Summary
                            </h4>
                            <div className="my-3 space-y-1.5 border-t border-b border-border py-3 text-left text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Packaging:</span>
                                    <span className="font-medium text-foreground">
                                        ${activeBox.price.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        Selected Items ({selectedItems.length}):
                                    </span>
                                    <span className="font-medium text-foreground">
                                        ${itemsTotal.toFixed(2)}
                                    </span>
                                </div>
                                {cardMessage.trim() && (
                                    <div className="border-t border-dashed border-border pt-1.5">
                                        <span className="block text-xs tracking-wider text-muted-foreground/60 uppercase">
                                            Card Message Preview:
                                        </span>
                                        <p className="mt-1 truncate text-xs text-foreground/80 italic">
                                            "{cardMessage}"
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="font-serif text-xl text-foreground">
                                    Total Price:
                                </span>
                                <span className="font-serif text-2xl font-bold text-primary">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Options Selector Column */}
                    <div className="border border-border bg-white p-8">
                        {/* 1. Choose Box Style */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">
                                1. Packaging Style
                            </h4>
                            <Radio.Group
                                value={selectedBox}
                                onChange={(e) => setSelectedBox(e.target.value)}
                                className="grid w-full grid-cols-3 gap-4"
                            >
                                {boxStyles.map((b) => (
                                    <Radio.Button
                                        key={b.key}
                                        value={b.key}
                                        className="flex! h-auto! flex-col! items-center! justify-center! rounded-none! border-border! py-4! text-center! checked:border-primary! hover:border-primary!"
                                    >
                                        <div
                                            className="mb-2 h-5 w-5 rounded-full border border-black/10"
                                            style={{
                                                backgroundColor: b.colorBg,
                                            }}
                                        />
                                        <span className="block text-xs leading-tight">
                                            {b.name.split(' ')[0]}
                                        </span>
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                        {/* 2. Choose Products */}
                        <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="flex items-center gap-1.5 text-sm font-semibold tracking-wider text-foreground uppercase">
                                    2. Bundle Items{' '}
                                    <span className="text-xs text-muted-foreground lowercase">
                                        ({selectedItemIds.length} selected, min
                                        3 / max 5)
                                    </span>
                                </h4>
                                <Tooltip title="Add between 3 to 5 items to bundle inside your gift box.">
                                    <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {availableItems.map((item) => {
                                    const isSelected = selectedItemIds.includes(
                                        item.id,
                                    );

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                handleItemToggle(item.id)
                                            }
                                            className={`flex items-center justify-between border p-3 text-left transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-background'
                                                    : 'border-border hover:border-primary'
                                            }`}
                                        >
                                            <div>
                                                <div className="text-xs leading-tight font-semibold text-foreground">
                                                    {item.name}
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={isSelected}
                                                className="pointer-events-none"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Card Message */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">
                                3. Gift Card Message
                            </h4>
                            <Input.TextArea
                                placeholder="Type a lovely note to print on the gift card..."
                                value={cardMessage}
                                onChange={(e) => setCardMessage(e.target.value)}
                                rows={4}
                                maxLength={250}
                                showCount
                                className="rounded-none! hover:border-accent focus:border-accent"
                            />
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            block
                            disabled={isAddDisabled}
                            onClick={handleAdd}
                            style={{
                                background: isAddDisabled
                                    ? '#f5f5f5'
                                    : 'var(--primary)',
                                color: isAddDisabled ? '#c0c0c0' : '#fff',
                                height: 50,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                letterSpacing: '0.05em',
                            }}
                            className="tracking-wider uppercase"
                        >
                            {isSubmitting
                                ? 'Adding to Cart...'
                                : selectedItemIds.length < 3
                                  ? 'Select At Least 3 Items'
                                  : 'Add Custom Box to Cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
