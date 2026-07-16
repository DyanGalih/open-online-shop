import { Head, router } from '@inertiajs/react';
import { Layout, Typography } from 'antd';
import { Search, Heart, ShoppingBasket } from 'lucide-react';
import React, { useState } from 'react';
import BenefitsSection from '@/components/home/benefits-section';
import CartDrawer from '@/components/home/cart-drawer';
import CustomizerSection from '@/components/home/customizer-section';
import FooterSection from '@/components/home/footer-section';
import HeroSection from '@/components/home/hero-section';
import PersonalizedWidget from '@/components/home/personalized-widget';
import ProductGrid from '@/components/home/product-grid';
import ReviewsSection from '@/components/home/reviews-section';
import SearchForm from '@/components/home/search-form';
import SearchModal from '@/components/home/search-modal';


const { Header, Content } = Layout;
const { Title } = Typography;

export default function Index({ products, categories, personalized, auth }: any) {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    

    const handleSearch = (values: any) => {
        router.get('/', values, { preserveState: true, replace: true });
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#F5F3FA' }}>
            <Head>
                <title>Open Online Shop - Cozy Custom Doll Shop</title>
                <meta name="description" content="Welcome to the best online shop for discovering great products." />
            </Head>
            
            <Header style={{ padding: 0, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #e5e7eb' }}>
                <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="md:gap-3">
                        <div className="w-8 h-8 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center rounded-full" style={{ background: 'linear-gradient(to top right, #F4C1C1, #C9C4E9)' }}>
                            <svg className="w-4 h-4 md:w-[22px] md:h-[22px]" viewBox="0 0 24 24" fill="white">
                                <circle cx="6" cy="7" r="4.5" />
                                <circle cx="18" cy="7" r="4.5" />
                                <circle cx="12" cy="14" r="8.5" />
                                <circle cx="9" cy="13" r="1.5" fill="#D3A5A5" />
                                <circle cx="15" cy="13" r="1.5" fill="#D3A5A5" />
                                <circle cx="12" cy="16" r="1.5" fill="#D3A5A5" />
                            </svg>
                        </div>
                        <Title level={4} className="whitespace-nowrap !text-lg md:!text-2xl" style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
                            <span style={{ color: '#D48686' }}>Open </span>
                            <span style={{ color: '#627B9B' }}>Online Shop</span>
                        </Title>
                    </div>
                    <div className="hidden md:flex" style={{ gap: '20px' }}>
                        <a href="#customizer" style={{ color: '#3C3542', fontWeight: 'bold' }}>Customizer</a>
                        <a href="#catalog" style={{ color: '#3C3542', fontWeight: 'bold' }}>Adoption Center</a>
                        <a href="#benefits" style={{ color: '#3C3542', fontWeight: 'bold' }}>Our Promise</a>
                        <a href="#reviews" style={{ color: '#3C3542', fontWeight: 'bold' }}>Happy Parents</a>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <Search onClick={() => setIsSearchModalOpen(true)} size={20} style={{ cursor: 'pointer', color: '#3C3542' }} />
                        <Heart size={20} style={{ cursor: 'pointer', color: '#3C3542' }} />
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            style={{ 
                            background: '#3C3542', 
                            color: '#fff',  
                            border: 'none', 
                            padding: '6px 14px', 
                            borderRadius: 20, 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            lineHeight: 1,
                            height: 'fit-content'
                        }}>
                            <ShoppingBasket size={15} />
                            Bag
                            <span style={{ 
                                background: '#D3C5EE', 
                                color: '#3C3542', 
                                borderRadius: '50%', 
                                width: 18, 
                                height: 18, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}>1</span>
                        </button>
                    </div>
                </div>
            </Header>

            <Content style={{ width: '100%' }}>
                
                <HeroSection />
                <CustomizerSection />

                {/* Catalog Section */}
                <div id="catalog" style={{ background: '#F0FDF4' }}>
                    <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 0' }}>
                        <Title level={2} style={{ color: '#3C3542' }}>Adopt Pre-loved Friends</Title>
                        <p style={{ color: '#4b5563', marginBottom: 30 }}>Our handmade preset companions. Fast secure shipping.</p>
                        
                        {auth?.user && personalized && (
                            <PersonalizedWidget 
                                recentlyViewed={personalized.recently_viewed || []}
                                recommended={personalized.recommended || []}
                                hasRecentOrder={personalized.has_recent_order || false}
                            />
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <SearchForm categories={categories} onSearch={handleSearch} />
                        </div>

                        <ProductGrid products={products} />
                    </div>
                </div>

                <BenefitsSection />
                <ReviewsSection />

            </Content>

            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <FooterSection />
        </Layout>
    );
}
