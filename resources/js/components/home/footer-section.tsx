import { Row, Col, Input, Button } from 'antd';
import React from 'react';

export default function FooterSection() {
    return (
        <footer style={{ background: '#FAF8F5', borderTop: '1px solid #E5E7EB', color: '#4B5563' }}>
            <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 0' }}>
                <Row gutter={[40, 40]}>
                    <Col xs={24} md={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 20 }}>
                        <div style={{ 
                            width: 40, 
                            height: 40, 
                            background: 'linear-gradient(to top right, #F2C1C1, #D3C5EE)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <div style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%' }}></div>
                                <div style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%' }}></div>
                            </div>
                        </div>
                        <h2 style={{ margin: 0, color: '#596582', fontWeight: 900, fontSize: '1.4rem' }}>Open Online Shop</h2>
                    </div>
                        <p style={{ color: '#9CA3AF', margin: '16px 0 0 0', lineHeight: 1.6, maxWidth: 300, fontSize: '0.9rem' }}>
                            Handcrafted, sustainable companions delivered right to your door in cozy, eco-friendly packaging.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600, marginTop: 24 }}>
                            &copy; 2026 Open Online Shop. All Rights Cozy.
                        </p>
                    </Col>

                <Col xs={24} sm={12} md={5}>
                    <h3 style={{ color: '#3C3542', fontWeight: 900, marginBottom: 24, fontSize: '1.1rem' }}>Support & Adoption</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Adoption Policy</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Shipping & Tracking</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Plushie Wash Guide</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Nursery Care Team</a></li>
                    </ul>
                </Col>

                <Col xs={24} sm={12} md={5}>
                    <h3 style={{ color: '#3C3542', fontWeight: 900, marginBottom: 24, fontSize: '1.1rem' }}>Company & Story</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>TahuBeres Studio</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Eco-Velvet Farms</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Crafting Blog</a></li>
                        <li><a href="#" style={{ color: '#4B5563', fontWeight: 600, textDecoration: 'none' }}>Jobs (Sewing Wizards)</a></li>
                    </ul>
                </Col>

                <Col xs={24} md={6}>
                    <h3 style={{ color: '#3C3542', fontWeight: 900, marginBottom: 20, fontSize: '1.1rem' }}>Nursery Newsletter</h3>
                    <p style={{ lineHeight: 1.6, marginBottom: 24, fontSize: '0.9rem' }}>
                        Join our cozy circle to receive notices of new patterns, limited edition drops, and exclusive discount codes.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Input 
                            placeholder="Email coordinates..." 
                            style={{ borderRadius: 8, padding: '12px 16px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }} 
                        />
                        <Button 
                            style={{ 
                                background: '#EBBAB7', 
                                color: '#8C4D4A', 
                                border: 'none',
                                borderRadius: 8, 
                                padding: '0 24px', 
                                height: 'auto',
                                fontWeight: 700 
                            }}
                        >
                            Join
                        </Button>
                    </div>
                </Col>
                </Row>
            </div>
        </footer>
    );
}
