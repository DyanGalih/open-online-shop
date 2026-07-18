import productPlaceholder from '@/../../resources/images/home/product-placeholder.svg';
import { formatCurrency } from '@/lib/currency';
import type { Product } from '@/types/home-page';

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

    const getProductImage = () => productPlaceholder;

    return (
        <div className="mb-12 w-full border border-border bg-white p-6 font-sans md:p-8">
            <h3 className="mb-4 font-serif text-2xl text-foreground">
                Welcome Back
            </h3>

            {recentlyViewed.length > 0 && (
                <div>
                    <h4 className="mb-4 font-serif text-lg text-foreground">
                        Recently Viewed Items
                    </h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {recentlyViewed.map((p) => (
                            <div
                                key={p.id}
                                className="group relative flex flex-col border border-border bg-background/30 p-4"
                            >
                                <div className="relative mb-3 aspect-square w-full overflow-hidden bg-[#f9f9f9]">
                                    <img
                                        src={getProductImage()}
                                        alt={p.name}
                                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h5 className="mb-1 text-sm leading-tight font-medium text-foreground">
                                    {p.name}
                                </h5>
                                <p className="mb-3 text-xs font-semibold text-foreground">
                                    {formatCurrency(p.price)}
                                </p>
                                <button
                                    onClick={() => onAddToCart?.(p)}
                                    className="w-full bg-primary py-1.5 text-[10px] font-medium tracking-wider text-white uppercase transition-colors hover:bg-primary/90"
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
