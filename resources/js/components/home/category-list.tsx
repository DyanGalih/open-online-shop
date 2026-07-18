import categoryPlaceholder from '@/../../resources/images/home/category-placeholder.svg';
import type { Category } from '@/types/home-page';

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
    const getCategoryImage = () => {
        return categoryPlaceholder;
    };

    return (
        <section className="w-full bg-background py-16 font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                        Shop by Category
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {/* "All" Category card */}
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`group block border bg-white text-left transition-all duration-300 ${
                            selectedCategoryId === null
                                ? 'border-primary shadow-md'
                                : 'border-border hover:shadow-md'
                        }`}
                    >
                        <div className="aspect-square w-full overflow-hidden bg-gray-200">
                            <img
                                src={categoryPlaceholder}
                                alt="All Products"
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="mb-1 font-serif text-base text-foreground md:text-lg">
                                All Products
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
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
                                        ? 'border-primary shadow-md'
                                        : 'border-border hover:shadow-md'
                                }`}
                            >
                                <div className="aspect-square w-full overflow-hidden bg-gray-200">
                                    <img
                                        src={getCategoryImage()}
                                        alt={c.name}
                                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="mb-1 font-serif text-base text-foreground md:text-lg">
                                        {c.name}
                                    </h3>
                                    <p className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
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
