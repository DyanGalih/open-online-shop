import React from 'react';

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    image_url: string | null;
}

interface PersonalizedWidgetProps {
    recentlyViewed: Product[];
    recommended: Product[];
    hasRecentOrder: boolean;
    onAddToCart?: (product: Product) => void;
}

export default function PersonalizedWidget({
    recentlyViewed,
    recommended,
    hasRecentOrder,
    onAddToCart,
}: PersonalizedWidgetProps) {
    if (
        recentlyViewed.length === 0 &&
        recommended.length === 0 &&
        !hasRecentOrder
    ) {
        return null;
    }

    const getProductImage = (slug: string) => {
        switch (slug) {
            case 'minimal-ceramic-mug':
                return 'https://placehold.co/600x800/eae3df/a3928f?text=Ceramic+Mug';
            case 'scented-soy-candle':
                return 'https://placehold.co/600x800/e6e1d9/a3928f?text=Soy+Candle';
            case 'canvas-everyday-tote':
                return 'https://placehold.co/600x800/e8ece6/a3928f?text=Tote+Bag';
            case 'classic-minimal-watch':
                return 'https://placehold.co/600x800/f3e8e6/a3928f?text=Watch';
            default:
                return 'https://placehold.co/600x800/eae3df/a3928f?text=Product+Image';
        }
    };

    return (
        <div className="mb-12 w-full border border-[#eaeaea] bg-white p-6 font-sans md:p-8">
            <h3 className="mb-4 font-serif text-2xl text-[#333333]">
                Welcome Back
            </h3>

            {hasRecentOrder && (
                <div className="mb-6 flex items-center justify-between border-b border-[#eaeaea] pb-4">
                    <span className="text-sm text-[#666666]">
                        Your recent order has been shipped!
                    </span>
                    <a
                        href="/orders/recent"
                        className="text-xs font-semibold tracking-wider text-[#859b84] uppercase transition-colors hover:text-[#728871]"
                    >
                        Track Delivery →
                    </a>
                </div>
            )}

            {recentlyViewed.length > 0 && (
                <div>
                    <h4 className="mb-4 font-serif text-lg text-[#333333]">
                        Recently Viewed Items
                    </h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {recentlyViewed.map((p) => (
                            <div
                                key={p.id}
                                className="group relative flex flex-col border border-[#eaeaea] bg-[#fbf9f6]/30 p-4"
                            >
                                <div className="relative mb-3 aspect-square w-full overflow-hidden bg-[#f9f9f9]">
                                    <img
                                        src={getProductImage(p.slug)}
                                        alt={p.title}
                                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h5 className="mb-1 text-sm leading-tight font-medium text-[#333333]">
                                    {p.title}
                                </h5>
                                <p className="mb-3 text-xs font-semibold text-[#333333]">
                                    ${p.price.toFixed(2)}
                                </p>
                                <button
                                    onClick={() => onAddToCart?.(p)}
                                    className="w-full bg-[#859b84] py-1.5 text-[10px] font-medium tracking-wider text-white uppercase transition-colors hover:bg-[#728871]"
                                >
                                    Quick Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
