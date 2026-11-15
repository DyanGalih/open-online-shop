import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FilterDrawer } from '@/components/storefront/filter-drawer';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    };
}

export default function CatalogIndex({ products, categories, filters }: Props) {
    const handleFilterChange = (newFilters: Record<string, string | undefined>) => {
        router.get('/catalog', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
                        <p className="text-muted-foreground">
                            Browse through our collection ({products.total} products found)
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FilterDrawer
                            categories={categories}
                            initialSearch={filters.search}
                            initialCategory={filters.category}
                            initialMinPrice={filters.minPrice}
                            initialMaxPrice={filters.maxPrice}
                            onApply={(applied) => handleFilterChange(applied)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.data.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No products found matching your criteria.
                        </div>
                    ) : (
                        products.data.map((product) => (
                            <Card key={product.id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <div className="text-xs text-muted-foreground uppercase font-semibold">
                                        {product.category?.name ?? 'General'}
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {product.description ?? 'No description provided.'}
                                    </p>
                                    <div className="mt-4 text-xl font-bold">
                                        ${(product.price / 100).toFixed(2)}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            router.post(`/cart/add?product_id=${product.id}&quantity=1`);
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {products.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-6">
                        {products.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
