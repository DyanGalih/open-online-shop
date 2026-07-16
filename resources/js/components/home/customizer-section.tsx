import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title } = Typography;

export default function CustomizerSection() {
    return (
        <div style={{ background: '#F8F5FF' }}>
            <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div id="customizer" style={{ padding: '60px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ color: '#3C3542' }}>Design Your Own Companion</Title>
                <p style={{ color: '#4b5563' }}>Select your animal body, choose a beautiful calming palette flavor, and decorate.</p>
            </div>
            <Row gutter={[32, { xs: 16, lg: 32 }]} className="px-4 lg:px-10">
                <Col xs={24} lg={12}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
                        <div style={{ background: '#F5F3FF', width: '100%', height: 300, borderRadius: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://placehold.co/200x200?text=Preview" alt="Custom Preview" style={{ borderRadius: '50%' }} />
                        </div>
                        <h3 style={{ marginTop: 20, borderBottom: '2px dashed #F2C1C1', paddingBottom: 5, color: '#3C3542' }}>Name your Plushie...</h3>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 30, border: '1px solid #e5e7eb' }}>
                        <Title level={5}>1. Choose Companion Base</Title>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <button style={{ padding: '10px 20px', borderRadius: 8, border: '2px solid #F2C1C1', background: '#FDF7F7', cursor: 'pointer' }}>Bunny</button>
                            <button style={{ padding: '10px 20px', borderRadius: 8, border: '2px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Bear</button>
                            <button style={{ padding: '10px 20px', borderRadius: 8, border: '2px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Kitten</button>
                        </div>
                        
                        <Title level={5}>2. Velvet Color Flavor</Title>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F2C1C1', border: '2px solid #B86D6D' }}></div>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#B9D5F0' }}></div>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#BBDAB4' }}></div>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#D3C5EE' }}></div>
                        </div>

                        <Title level={5}>3. Facial Expression</Title>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <button style={{ padding: '10px 20px', borderRadius: 8, border: '2px solid #B9D5F0', background: '#f9fafb', cursor: 'pointer' }}>😊 Cozy</button>
                            <button style={{ padding: '10px 20px', borderRadius: 8, border: '2px solid transparent', background: '#f9fafb', cursor: 'pointer' }}>😴 Sleepy</button>
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-4" style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                            <Title level={3} style={{ margin: 0, wordBreak: 'break-word' }}>$40.55</Title>
                            <button style={{ background: '#3C3542', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Adopt Custom Doll!</button>
                        </div>
                    </div>
                </Col>
            </Row>
                </div>
            </div>
        </div>
    );
}
