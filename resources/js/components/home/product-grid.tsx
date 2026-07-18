import productPlaceholder from '@/../../resources/images/home/product-placeholder.svg';
import { Product } from '@/types/home-page';
import { Heart, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface ProductGridProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({
    products,
    onAddToCart,
}: ProductGridProps) {
    const getProductImage = () => {
        // In production, we'd use p.file_path. For now, we use our local placeholder.
        return productPlaceholder;
    };

    return (
        <div className="grid w-full grid-cols-1 gap-8 font-sans sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
                <div key={p.id} className="group relative flex flex-col">
                    {/* Image Area */}
                    <div className="relative h-80 w-full overflow-hidden rounded-none border border-border bg-[#f9f9f9]">
                        <img
                            src={getProductImage()}
                            alt={p.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:text-[#d89797]">
                            <Heart className="h-4 w-4" />
                        </button>

                        {/* Hover Add to Cart Overlay */}
                        <div className="absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                            <button
                                onClick={() => onAddToCart?.(p)}
                                className="w-full border border-transparent bg-white/90 py-2.5 text-xs font-medium tracking-wider text-foreground uppercase backdrop-blur transition-colors hover:bg-primary hover:text-white"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-grow flex-col pt-4">
                        <h3 className="text-sm font-medium text-foreground transition-colors hover:text-primary md:text-base">
                            <a href="#">{p.name}</a>
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            {formatCurrency(p.price)}
                        </p>

                        {/* Ratings */}
                        <div className="mt-2 flex items-center">
                            <div className="flex space-x-0.5 text-[#e8c07d]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`h-3 w-3 ${star <= Math.round(p.rating || 0) ? 'fill-current' : 'fill-none stroke-current opacity-50'}`} 
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-[11px] text-muted-foreground">
                                ({p.reviews_count || 0})
                            </span>
                        </div>

                        {/* Mobile Add to Cart Button (always visible) */}
                        <div className="mt-4 block md:hidden">
                            <button
                                onClick={() => onAddToCart?.(p)}
                                className="w-full bg-primary py-2.5 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-primary/90"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {products.length === 0 && (
                <div className="col-span-full py-12 text-center">
                    <p className="text-sm text-[#666666]">
                        No products found in this category.
                    </p>
                </div>
            )}
        </div>
    );
}
