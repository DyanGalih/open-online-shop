import { Head, usePage } from '@inertiajs/react';
import { ConfigProvider } from 'antd';
import {
    Heart,
    Leaf,
    Menu as MenuIcon,
    Search,
    ShoppingBag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BenefitsSection from '@/components/home/benefits-section';
import type { CartItem } from '@/components/home/cart-drawer';
import CartDrawer from '@/components/home/cart-drawer';
import CategoryList from '@/components/home/category-list';
import FooterSection from '@/components/home/footer-section';
import HeroSection from '@/components/home/hero-section';
import PersonalizedWidget from '@/components/home/personalized-widget';
import ProductGrid from '@/components/home/product-grid';
import ReviewsSection from '@/components/home/reviews-section';
import SearchModal from '@/components/home/search-modal';
import { liviaTheme } from '@/themes/livia-theme';
import type { HomePageProps, Product } from '@/types/home-page';

export default function Index({
    products,
    categories,
    personalized,
    filters,
    auth,
}: HomePageProps) {
    const { name } = usePage<{ name: string }>().props;
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        filters?.categoryId ?? null,
    );
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('online_shop_cart');

            return saved ? JSON.parse(saved) : [];
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem('online_shop_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleAddToCart = (product: Product) => {
        setCartItems((prev) => {
            const existingIdx = prev.findIndex(
                (item) =>
                    item.productId === product.id && item.type === 'standard',
            );

            if (existingIdx > -1) {
                const updated = [...prev];
                updated[existingIdx].quantity += 1;

                return updated;
            }

            return [
                ...prev,
                {
                    id: `standard-${product.id}-${Date.now()}`,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    filePath: product.filePath,
                    type: 'standard',
                },
            ];
        });
        setIsCartOpen(true); // Open drawer for immediate feedback
    };

    const handleUpdateQuantity = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;

                        return newQty > 0
                            ? { ...item, quantity: newQty }
                            : null;
                    }

                    return item;
                })
                .filter((item): item is CartItem => item !== null),
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Client-side category filtering
    const filteredProducts = selectedCategoryId
        ? products.filter((p) => Number(p.categoryId) === selectedCategoryId)
        : products;

    const totalCartCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <ConfigProvider theme={liviaTheme}>
            <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary selection:text-white">
                <Head>
                    <title>{`${name} - Simple Things, Beautiful Life`}</title>
                    <meta
                        name="description"
                        content="Thoughtfully designed products to make your everyday life better. Simple things, beautiful life."
                    />
                </Head>

                {/* Announcement Bar */}
                <div className="border-b border-[#f3e8e6] bg-[#fcf8f6] py-2.5 text-center font-sans text-xs text-muted-foreground">
                    <p className="flex items-center justify-center gap-1">
                        Free shipping on orders over $75{' '}
                        <Heart className="h-3.5 w-3.5 fill-current text-accent" />
                    </p>
                </div>

                {/* Sticky Header */}
                <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md transition-all sm:px-6 lg:px-8">
                    <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 cursor-pointer items-center">
                            <div className="flex flex-col items-center">
                                <span className="flex items-center font-serif text-3xl font-semibold tracking-tight text-foreground">
                                    {name}
                                    <Leaf className="ml-1 h-5 w-5 text-primary opacity-80" />
                                </span>
                                <span className="mt-0.5 text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                                    — online shop —
                                </span>
                            </div>
                        </div>

                        {/* Navigation links */}
                        <nav className="hidden space-x-8 md:flex">
                            <a
                                href="#"
                                className="border-b-2 border-accent pb-1 text-sm font-medium text-primary"
                            >
                                Home
                            </a>
                            <a
                                href="#catalog"
                                className="pb-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Shop
                            </a>
                            <a
                                href="#customizer"
                                className="pb-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Gift Builder
                            </a>
                            <a
                                href="#reviews"
                                className="pb-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Stories
                            </a>
                        </nav>

                        {/* Utility Icons */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => setIsSearchModalOpen(true)}
                                className="text-foreground transition-colors hover:text-primary"
                            >
                                <Search size={20} />
                            </button>
                            <button className="hidden text-foreground transition-colors hover:text-primary sm:block">
                                <Heart size={20} />
                            </button>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative flex items-center text-foreground transition-colors hover:text-primary"
                            >
                                <ShoppingBag size={20} />
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] leading-none font-bold text-white">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>
                            {/* Mobile menu toggle */}
                            <button className="text-foreground md:hidden">
                                <MenuIcon size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="w-full flex-grow">
                    <HeroSection />
                    <BenefitsSection />

                    {/* Category List Cards */}
                    <CategoryList
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />

                    {/* Catalog Grid */}
                    <div id="catalog" className="bg-white py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-10 flex items-end justify-between border-b border-border pb-4">
                                <div>
                                    <h2 className="font-serif text-3xl text-foreground">
                                        Best Sellers
                                    </h2>
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Showing{' '}
                                        {selectedCategoryId
                                            ? categories.find(
                                                (c) =>
                                                    c.id ===
                                                    selectedCategoryId,
                                            )?.name
                                            : 'All'}{' '}
                                        Collection
                                    </p>
                                </div>
                                <a
                                    href="#catalog"
                                    className="text-xs font-semibold tracking-wider text-foreground uppercase transition-colors hover:text-primary"
                                >
                                    View All Items →
                                </a>
                            </div>

                            {auth?.user && personalized && (
                                <PersonalizedWidget
                                    recentlyViewed={
                                        personalized.recently_viewed || []
                                    }
                                    recommended={personalized.recommended || []}
                                    hasRecentOrder={
                                        personalized.has_recent_order || false
                                    }
                                    onAddToCart={handleAddToCart}
                                />
                            )}

                            <ProductGrid
                                products={filteredProducts}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>

                    <ReviewsSection />
                </main>

                {/* Global Overlays */}
                <SearchModal
                    isOpen={isSearchModalOpen}
                    onClose={() => setIsSearchModalOpen(false)}
                />
                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                />
                <FooterSection />
            </div>
        </ConfigProvider>
    );
}
