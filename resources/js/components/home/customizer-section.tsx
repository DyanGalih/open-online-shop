import { Button, Input, Checkbox, Radio, Tooltip } from 'antd';
import { Gift, Info } from 'lucide-react';
import React, { useState } from 'react';

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    image_url: string | null;
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
            image: 'https://placehold.co/400x300/ebe5e0/a3928f?text=Kraft+Box',
        },
        {
            key: 'sage-ribbon',
            name: 'Sage Ribbon Box',
            price: 12.0,
            colorBg: '#859b84',
            image: 'https://placehold.co/400x300/859b84/ffffff?text=Sage+Ribbon+Box',
        },
        {
            key: 'blossom-pink',
            name: 'Blossom Pink Box',
            price: 12.0,
            colorBg: '#e6b3b3',
            image: 'https://placehold.co/400x300/e6b3b3/ffffff?text=Blossom+Pink+Box',
        },
    ];

    const availableItems: Product[] = [
        {
            id: 1,
            title: 'Minimal Ceramic Mug',
            slug: 'minimal-ceramic-mug',
            price: 18.0,
            image_url: null,
        },
        {
            id: 2,
            title: 'Scented Soy Candle',
            slug: 'scented-soy-candle',
            price: 22.0,
            image_url: null,
        },
        {
            id: 3,
            title: 'Canvas Everyday Tote',
            slug: 'canvas-everyday-tote',
            price: 34.0,
            image_url: null,
        },
        {
            id: 4,
            title: 'Classic Minimal Watch',
            slug: 'classic-minimal-watch',
            price: 49.0,
            image_url: null,
        },
    ];

    const [selectedBox, setSelectedBox] = useState('kraft-box');
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [cardMessage, setCardMessage] = useState('');

    const activeBox =
        boxStyles.find((b) => b.key === selectedBox) || boxStyles[0];

    // Calculate prices
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

        onAddGiftBoxToCart?.({
            boxStyle: activeBox.name,
            items: selectedItems,
            cardMessage,
            totalPrice,
        });
        // Reset customizer
        setSelectedItemIds([]);
        setCardMessage('');
    };

    const isAddDisabled = selectedItemIds.length < 3;

    return (
        <section
            id="customizer"
            className="w-full border-b border-[#eaeaea] bg-[#fcfbf9] py-20 font-sans"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 font-serif text-3xl text-[#333333] md:text-4xl">
                        Custom Gift Box Builder
                    </h2>
                    <p className="mx-auto max-w-md leading-relaxed text-[#666666]">
                        Design a bespoke gift package. Select a box style,
                        bundle 3 to 5 lifestyle items, and write a custom card
                        message.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Live Preview Column */}
                    <div className="flex min-h-[400px] flex-col items-center justify-center border border-[#eaeaea] bg-white p-8">
                        <div className="relative mb-6 flex aspect-[4/3] w-full max-w-sm items-center justify-center overflow-hidden border border-[#eaeaea] bg-[#f9f9f9]">
                            <img
                                src={activeBox.image}
                                alt={activeBox.name}
                                className="h-full w-full object-cover object-center"
                            />
                            <div className="absolute bottom-3 left-3 border border-[#eaeaea] bg-white/90 px-3 py-1 text-xs font-medium tracking-wider text-[#333333] uppercase backdrop-blur">
                                {activeBox.name}
                            </div>
                        </div>
                        <div className="w-full max-w-sm text-center">
                            <h4 className="mb-2 flex items-center justify-center gap-2 font-serif text-lg text-[#333333]">
                                <Gift className="h-4 w-4 text-[#859b84]" /> Gift
                                Box Summary
                            </h4>
                            <div className="my-3 space-y-1.5 border-t border-b border-[#eaeaea] py-3 text-left text-sm text-[#666666]">
                                <div className="flex justify-between">
                                    <span>Packaging:</span>
                                    <span className="font-medium text-[#333333]">
                                        ${activeBox.price.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        Selected Items ({selectedItems.length}):
                                    </span>
                                    <span className="font-medium text-[#333333]">
                                        ${itemsTotal.toFixed(2)}
                                    </span>
                                </div>
                                {cardMessage.trim() && (
                                    <div className="border-t border-dashed border-[#eaeaea] pt-1.5">
                                        <span className="block text-xs tracking-wider text-[#999999] uppercase">
                                            Card Message Preview:
                                        </span>
                                        <p className="mt-1 truncate text-xs text-[#4b5563] italic">
                                            "{cardMessage}"
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="font-serif text-xl text-[#333333]">
                                    Total Price:
                                </span>
                                <span className="font-serif text-2xl font-bold text-[#859b84]">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Options Selector Column */}
                    <div className="border border-[#eaeaea] bg-white p-8">
                        {/* 1. Choose Box Style */}
                        <div className="mb-8">
                            <h4 className="mb-4 text-sm font-semibold tracking-wider text-[#333333] uppercase">
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
                                        className="flex! h-auto! flex-col! items-center! justify-center! rounded-none! border-[#eaeaea]! py-4! text-center! checked:border-[#859b84]! hover:border-[#859b84]!"
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
                                <h4 className="flex items-center gap-1.5 text-sm font-semibold tracking-wider text-[#333333] uppercase">
                                    2. Bundle Items{' '}
                                    <span className="text-xs text-[#999999] lowercase">
                                        ({selectedItemIds.length} selected, min
                                        3 / max 5)
                                    </span>
                                </h4>
                                <Tooltip title="Add between 3 to 5 items to bundle inside your gift box.">
                                    <Info className="h-4 w-4 cursor-pointer text-[#666666]" />
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
                                                    ? 'border-[#859b84] bg-[#fbf9f6]'
                                                    : 'border-[#eaeaea] hover:border-[#859b84]'
                                            }`}
                                        >
                                            <div>
                                                <div className="text-xs leading-tight font-semibold text-[#333333]">
                                                    {item.title}
                                                </div>
                                                <div className="mt-1 text-xs text-[#666666]">
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
                            <h4 className="mb-4 text-sm font-semibold tracking-wider text-[#333333] uppercase">
                                3. Gift Card Message
                            </h4>
                            <Input.TextArea
                                placeholder="Type a lovely note to print on the gift card (max 250 characters)..."
                                value={cardMessage}
                                onChange={(e) =>
                                    setCardMessage(e.target.value.slice(0, 250))
                                }
                                rows={3}
                                className="rounded-none!"
                            />
                            <div className="mt-1.5 text-right text-xs text-[#999999]">
                                {cardMessage.length}/250 characters
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            block
                            disabled={isAddDisabled}
                            onClick={handleAdd}
                            style={{
                                background: isAddDisabled
                                    ? '#f5f5f5'
                                    : '#859b84',
                                color: isAddDisabled ? '#c0c0c0' : '#fff',
                                height: 50,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: 'none',
                                borderRadius: 0,
                                letterSpacing: '0.05em',
                            }}
                            className="tracking-wider uppercase"
                        >
                            {isAddDisabled
                                ? 'Select At Least 3 Items'
                                : 'Add Custom Box to Cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
