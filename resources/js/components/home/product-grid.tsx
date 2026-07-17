import { Heart, Star } from 'lucide-react';
import React from 'react';

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    image_url: string | null;
}

interface ProductGridProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({
    products,
    onAddToCart,
}: ProductGridProps) {
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
        <div className="grid w-full grid-cols-1 gap-8 font-sans sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
                <div key={p.id} className="group relative flex flex-col">
                    {/* Image Area */}
                    <div className="relative h-80 w-full overflow-hidden rounded-none border border-[#eaeaea] bg-[#f9f9f9]">
                        <img
                            src={getProductImage(p.slug)}
                            alt={p.title}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Wishlist Button */}
                        <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#eaeaea] bg-white text-[#666666] shadow-sm transition-colors hover:text-[#d89797]">
                            <Heart className="h-4 w-4" />
                        </button>

                        {/* Hover Add to Cart Overlay */}
                        <div className="absolute inset-x-0 bottom-0 hidden p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                            <button
                                onClick={() => onAddToCart?.(p)}
                                className="w-full border border-transparent bg-white/90 py-2.5 text-xs font-medium tracking-wider text-[#333333] uppercase backdrop-blur transition-colors hover:bg-[#859b84] hover:text-white"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-grow flex-col pt-4">
                        <h3 className="text-sm font-medium text-[#333333] transition-colors hover:text-[#859b84] md:text-base">
                            <a href="#">{p.title}</a>
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#333333]">
                            ${p.price.toFixed(2)}
                        </p>

                        {/* Ratings */}
                        <div className="mt-2 flex items-center">
                            <div className="flex space-x-0.5 text-[#e8c07d]">
                                <Star className="h-3 w-3 fill-current" />
                                <Star className="h-3 w-3 fill-current" />
                                <Star className="h-3 w-3 fill-current" />
                                <Star className="h-3 w-3 fill-current" />
                                <Star className="h-3 w-3 fill-current opacity-50" />
                            </div>
                            <span className="ml-2 text-[11px] text-[#666666]">
                                (128)
                            </span>
                        </div>

                        {/* Mobile Add to Cart Button (always visible) */}
                        <div className="mt-4 block md:hidden">
                            <button
                                onClick={() => onAddToCart?.(p)}
                                className="w-full bg-[#859b84] py-2.5 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-[#728871]"
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
