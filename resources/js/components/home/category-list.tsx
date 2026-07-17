import React from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CategoryListProps {
    categories: Category[];
    selectedCategoryId: number | null;
    onSelectCategory: (id: number | null) => void;
}

export default function CategoryList({
    categories,
    selectedCategoryId,
    onSelectCategory,
}: CategoryListProps) {
    const getCategoryImage = (slug: string) => {
        switch (slug) {
            case 'home-living':
                return 'https://placehold.co/400x400/ebe5e0/a3928f?text=Vases+%26+Decor';
            case 'beauty-skincare':
                return 'https://placehold.co/400x400/f5ebe8/a3928f?text=Skincare+Bottles';
            case 'fashion':
                return 'https://placehold.co/400x400/efebe5/a3928f?text=Clothes+on+Rack';
            case 'accessories':
                return 'https://placehold.co/400x400/f4ebd8/a3928f?text=Handbag';
            case 'stationery':
                return 'https://placehold.co/400x400/eef2ed/a3928f?text=Notebooks';
            default:
                return 'https://placehold.co/400x400/eaddd6/a3928f?text=Lifestyle';
        }
    };

    return (
        <section className="w-full bg-[#fbf9f6] py-16 font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="font-serif text-3xl text-[#333333] md:text-4xl">
                        Shop by Category
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {/* "All" Category card */}
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`group block border bg-white text-left transition-all duration-300 ${
                            selectedCategoryId === null
                                ? 'border-[#859b84] shadow-md'
                                : 'border-[#eaeaea] hover:shadow-md'
                        }`}
                    >
                        <div className="aspect-square w-full overflow-hidden bg-gray-200">
                            <img
                                src="https://placehold.co/400x400/eaddd6/a3928f?text=All+Products"
                                alt="All Products"
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="mb-1 font-serif text-base text-[#333333] md:text-lg">
                                All Products
                            </h3>
                            <p className="text-xs font-medium text-[#666666] transition-colors group-hover:text-[#859b84]">
                                View all →
                            </p>
                        </div>
                    </button>

                    {categories.map((c) => {
                        const isSelected = selectedCategoryId === c.id;

                        return (
                            <button
                                key={c.id}
                                onClick={() => onSelectCategory(c.id)}
                                className={`group block border bg-white text-left transition-all duration-300 ${
                                    isSelected
                                        ? 'border-[#859b84] shadow-md'
                                        : 'border-[#eaeaea] hover:shadow-md'
                                }`}
                            >
                                <div className="aspect-square w-full overflow-hidden bg-gray-200">
                                    <img
                                        src={getCategoryImage(c.slug)}
                                        alt={c.name}
                                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="mb-1 font-serif text-base text-[#333333] md:text-lg">
                                        {c.name}
                                    </h3>
                                    <p className="text-xs font-medium text-[#666666] transition-colors group-hover:text-[#859b84]">
                                        Shop now →
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
