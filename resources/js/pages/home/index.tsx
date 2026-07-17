import { Head, usePage } from '@inertiajs/react';
import { ConfigProvider } from 'antd';
import {
    Search,
    Heart,
    ShoppingBag,
    Leaf,
    Menu as MenuIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import BenefitsSection from '@/components/home/benefits-section';
import type { CartItem } from '@/components/home/cart-drawer';
import CartDrawer from '@/components/home/cart-drawer';
import CategoryList from '@/components/home/category-list';
import CustomizerSection from '@/components/home/customizer-section';
import FooterSection from '@/components/home/footer-section';
import HeroSection from '@/components/home/hero-section';
import PersonalizedWidget from '@/components/home/personalized-widget';
import ProductGrid from '@/components/home/product-grid';
import ReviewsSection from '@/components/home/reviews-section';
import SearchModal from '@/components/home/search-modal';
import { liviaTheme } from '@/themes/livia-theme';


export default function Index({
    products,
    categories,
    personalized,
    auth,
}: any) {
    const { name } = usePage<{ name: string }>().props;
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [cartItems, setCartItems] = useState<CartItem[]>([
        // Initialize with one standard item to show default cart state
        {
            id: 'init-item-1',
            productId: 1,
            title: 'Minimal Ceramic Mug',
            price: 18.0,
            quantity: 1,
            type: 'standard',
        },
    ]);

    const handleAddToCart = (product: any) => {
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
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url,
                    type: 'standard',
                },
            ];
        });
        setIsCartOpen(true); // Open drawer for immediate feedback
    };

    const handleAddGiftBoxToCart = (giftBox: any) => {
        setCartItems((prev) => [
            ...prev,
            {
                id: `giftbox-${Date.now()}`,
                title: `${giftBox.boxStyle} Set`,
                price: giftBox.totalPrice,
                quantity: 1,
                type: 'gift-box',
                boxStyle: giftBox.boxStyle,
                items: giftBox.items,
                cardMessage: giftBox.cardMessage,
            },
        ]);
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
        ? products.filter((p: any) => p.category?.id === selectedCategoryId)
        : products;

    const totalCartCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <ConfigProvider theme={liviaTheme}>
            <div className="min-h-screen bg-[#fbf9f6] font-sans selection:bg-[#859b84] selection:text-white flex flex-col">
                <Head>
                    <title>{`${name} - Simple Things, Beautiful Life`}</title>
                    <meta
                        name="description"
                        content="Thoughtfully designed products to make your everyday life better. Simple things, beautiful life."
                    />
                </Head>

                {/* Announcement Bar */}
                <div className="border-b border-[#f3e8e6] bg-[#fcf8f6] py-2.5 text-center font-sans text-xs text-[#666666]">
                    <p className="flex items-center justify-center gap-1">
                        Free shipping on orders over $75{' '}
                        <Heart className="h-3.5 w-3.5 fill-current text-[#e6b3b3]" />
                    </p>
                </div>

                {/* Sticky Header */}
                <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#eaeaea] bg-[#fbf9f6]/95 px-4 backdrop-blur-md transition-all sm:px-6 lg:px-8">
                    <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 cursor-pointer items-center">
                            <div className="flex flex-col items-center">
                                <span className="flex items-center font-serif text-3xl font-semibold tracking-tight text-[#333333]">
                                    {name}
                                    <Leaf className="ml-1 h-5 w-5 text-[#859b84] opacity-80" />
                                </span>
                                <span className="mt-0.5 text-[9px] tracking-[0.2em] text-[#666666] uppercase">
                                    — online shop —
                                </span>
                            </div>
                        </div>

                        {/* Navigation links */}
                        <nav className="hidden space-x-8 md:flex">
                            <a
                                href="#"
                                className="border-b-2 border-[#e6b3b3] pb-1 text-sm font-medium text-[#333333]"
                            >
                                Home
                            </a>
                            <a
                                href="#catalog"
                                className="pb-1 text-sm font-medium text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                Shop
                            </a>
                            <a
                                href="#customizer"
                                className="pb-1 text-sm font-medium text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                Gift Builder
                            </a>
                            <a
                                href="#reviews"
                                className="pb-1 text-sm font-medium text-[#666666] transition-colors hover:text-[#859b84]"
                            >
                                Stories
                            </a>
                        </nav>

                        {/* Utility Icons */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => setIsSearchModalOpen(true)}
                                className="text-[#333333] transition-colors hover:text-[#859b84]"
                            >
                                <Search size={20} />
                            </button>
                            <button className="hidden text-[#333333] transition-colors hover:text-[#859b84] sm:block">
                                <Heart size={20} />
                            </button>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative flex items-center text-[#333333] transition-colors hover:text-[#859b84]"
                            >
                                <ShoppingBag size={20} />
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#e6b3b3] px-1 text-[9px] font-bold leading-none text-white">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>
                            {/* Mobile menu toggle */}
                            <button className="text-[#333333] md:hidden">
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
                            <div className="mb-10 flex items-end justify-between border-b border-[#eaeaea] pb-4">
                                <div>
                                    <h2 className="font-serif text-3xl text-[#333333]">
                                        Best Sellers
                                    </h2>
                                    <p className="mt-1.5 text-xs text-[#666666]">
                                        Showing{' '}
                                        {selectedCategoryId
                                            ? categories.find(
                                                  (c: any) =>
                                                      c.id ===
                                                      selectedCategoryId,
                                              )?.name
                                            : 'All'}{' '}
                                        Collection
                                    </p>
                                </div>
                                <a
                                    href="#catalog"
                                    className="text-xs font-semibold tracking-wider text-[#333333] uppercase transition-colors hover:text-[#859b84]"
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

                    <CustomizerSection
                        onAddGiftBoxToCart={handleAddGiftBoxToCart}
                    />
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
