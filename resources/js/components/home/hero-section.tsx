import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title } = Typography;

export default function HeroSection() {
    return (
        <div style={{ background: '#FFF5F5' }}>
            <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div className="py-6 md:py-[60px]">
                    <Row gutter={[32, 32]} align="middle">
                <Col xs={24} lg={10}>
                    <div style={{ display: 'inline-block', background: '#fff', padding: '5px 15px', borderRadius: 20, marginBottom: 20, border: '1px solid #e5e7eb' }}>
                        ✨ <span style={{ fontWeight: 'bold', color: '#7E69A3' }}>Adoptable Soft Magic</span>
                    </div>
                    <Title level={1} className="!text-4xl md:!text-[3rem] !leading-tight" style={{ color: '#3C3542', fontWeight: 900 }}>
                        Your Dream <br className="hidden md:block" /> Plushie Friend <br className="hidden md:block" /> Is Waiting!
                    </Title>
                    <p className="!text-base md:!text-[1.1rem]" style={{ color: '#4b5563', marginBottom: 30 }}>
                        Welcome to our cozy custom toy studio. Each friend is handcrafted with premium ultra-soft organic velvet, hyper-allergenic cloud filling, and a touch of calm magic.
                    </p>
                    <div style={{ display: 'flex', gap: 15 }}>
                        <button style={{ background: '#3C3542', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>Customizer Station</button>
                        <button style={{ background: '#fff', color: '#3C3542', border: '2px solid #e5e7eb', padding: '15px 30px', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>Meet Ready Friends</button>
                    </div>
                </Col>
                <Col xs={24} lg={14}>
                    <div style={{ background: '#fff', padding: 30, borderRadius: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                        <div style={{ background: 'linear-gradient(to bottom, #FDF7F7, #F2F7FC)', height: 300, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://placehold.co/200x200?text=Bunny" alt="Hero Bunny" style={{ borderRadius: '50%' }} />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <div style={{ marginBottom: 16 }}>
                                <Title level={4} style={{ margin: 0, color: '#3C3542' }}>Celeste the Dream Bunny</Title>
                                <p style={{ margin: 0, color: '#6b7280' }}>Muted lilac wizard hat & soft cheeks</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <Title level={3} style={{ margin: 0, wordBreak: 'break-word' }}>$40.55</Title>
                                <button style={{ background: '#B86D6D', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Adopt Her!</button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
                </div>
            </div>
        </div>
    );
}
