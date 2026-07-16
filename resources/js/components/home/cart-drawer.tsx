import { Drawer, Input, Button, Grid } from 'antd';
import { ShoppingBasket, Trash2, Minus, Plus } from 'lucide-react';
import React from 'react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const { useBreakpoint } = Grid;

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const screens = useBreakpoint();
    // Default to mobile placement if we haven't matched md yet (to be safe during resize)
    const isMobile = screens.md === false;

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {isMobile && (
                        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 2, margin: '0 auto 16px auto' }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ShoppingBasket color="#6D5A9C" size={24} />
                        <span style={{ color: '#3C3542', fontSize: '1.25rem', fontWeight: 900 }}>Shopping Bag</span>
                    </div>
                </div>
            }
            placement={isMobile ? 'bottom' : 'right'}
            onClose={onClose}
            open={isOpen}
            closeIcon={
                <div style={{ background: '#F3F4F6', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 20, color: '#9CA3AF', fontWeight: 'bold' }}>&times;</span>
                </div>
            }
            styles={{
                wrapper: { 
                    width: isMobile ? '100%' : 450,
                    height: isMobile ? '85vh' : '100%',
                    ...(isMobile ? { borderRadius: '24px 24px 0 0', overflow: 'hidden' } : {})
                },
                body: { padding: '24px' },
                footer: { padding: 0, borderTop: 'none' }
            }}
            footer={
                <div style={{ background: '#FAF8F5', padding: '24px', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                        <Input 
                            placeholder="PROMO CODE (E.G. COZY10)" 
                            style={{ borderRadius: 8, padding: '10px 16px', fontWeight: 600, fontSize: '0.8rem' }}
                        />
                        <Button 
                            style={{ 
                                background: '#3C3542', 
                                color: '#fff', 
                                borderRadius: 8, 
                                height: 'auto', 
                                padding: '0 24px', 
                                fontWeight: 700 
                            }}
                        >
                            Apply
                        </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, fontSize: '0.9rem', color: '#4B5563', fontWeight: 500 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Friend Adoption Subtotal:</span>
                            <span style={{ color: '#3C3542', fontWeight: 700 }}>$42.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#C86363' }}>Discount:</span>
                            <span style={{ color: '#C86363', fontWeight: 700 }}>-$0.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Safe Nursery Transport:</span>
                            <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>FREE</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px dashed #D1D5DB', margin: '16px 0' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3C3542' }}>Final Total:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3C3542' }}>$42.00</span>
                    </div>

                    <Button 
                        block 
                        style={{ 
                            background: '#3C3542', 
                            color: '#fff', 
                            height: 54, 
                            borderRadius: 12, 
                            fontWeight: 700, 
                            fontSize: '1rem',
                            border: 'none'
                        }}
                    >
                        Proceed to Adoption Agreement
                    </Button>
                </div>
            }
        >
            {/* Cart Items */}
            <div style={{ 
                border: '1px solid #F3F4F6', 
                borderRadius: 16, 
                padding: '16px', 
                display: 'flex', 
                gap: 16, 
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ 
                    width: 70, 
                    height: 70, 
                    background: '#F9FAFB', 
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <img src="/images/no_image.png" alt="Bubbles" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 800, color: '#3C3542', fontSize: '0.95rem' }}>Bubbles</h4>
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>My Design</span>
                        </div>
                        <Trash2 size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <span style={{ fontWeight: 800, color: '#3C3542', fontSize: '0.95rem' }}>$42.00</span>
                        
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            border: '1px solid #E5E7EB',
                            borderRadius: 20,
                            padding: '4px 8px',
                            gap: 12
                        }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#9CA3AF' }}><Minus size={12} /></button>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#3C3542' }}>1</span>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#9CA3AF' }}><Plus size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
