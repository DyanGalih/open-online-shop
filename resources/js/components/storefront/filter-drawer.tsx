import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface FilterDrawerProps {
    categories: Category[];
    initialSearch?: string;
    initialCategory?: string;
    initialMinPrice?: number | string;
    initialMaxPrice?: number | string;
    onApply: (filters: {
        search?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
    }) => void;
}

export function FilterDrawer({
    categories,
    initialSearch = '',
    initialCategory = '',
    initialMinPrice = '',
    initialMaxPrice = '',
    onApply,
}: FilterDrawerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState(initialMinPrice.toString());
    const [maxPrice, setMaxPrice] = useState(initialMaxPrice.toString());

    const handleApply = () => {
        onApply({
            search: search || undefined,
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
        });
        setOpen(false);
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        onApply({});
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search catalog..."
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="minPrice">Min Price</Label>
                            <Input
                                id="minPrice"
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="maxPrice">Max Price</Label>
                            <Input
                                id="maxPrice"
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button className="flex-1" onClick={handleApply}>
                            Apply
                        </Button>
                        <Button variant="ghost" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
