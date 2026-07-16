import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title } = Typography;

export default function ReviewsSection() {
    return (
        <div style={{ background: '#FFFBF5' }}>
            <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div id="reviews" style={{ padding: '60px 0', textAlign: 'center' }}>
                    <Title level={2}>Stories from Cozy Parents</Title>
                    <p style={{ color: '#6b7280', marginBottom: 40 }}>Read true reviews of sweet, gentle doll parents who welcomed a buddy home.</p>
                    <Row gutter={[32, 32]}>
                <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 30, borderRadius: 24, border: '1px solid #e5e7eb', textAlign: 'left' }}>
                        <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: 20 }}>"My custom pastel bear arrived with a lovely adoption plate. Hand-sewn detailing is absolutely marvelous and incredibly soft."</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F2C1C1' }}></div>
                            <div>
                                <strong>Emma Rose</strong>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Adopted Lavender Bunny</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 30, borderRadius: 24, border: '1px solid #e5e7eb', textAlign: 'left' }}>
                        <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: 20 }}>"I configured a wizard cat doll for my little sibling. They carry him everywhere! Ordering custom options was smooth on my smartphone."</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#D3C5EE' }}></div>
                            <div>
                                <strong>Lucas Vance</strong>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Custom Designer</div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 30, borderRadius: 24, border: '1px solid #e5e7eb', textAlign: 'left' }}>
                        <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: 20 }}>"Sensational palette curation! The soft, low-contrast dusty colors harmonize perfectly with clean minimalist decor. Highly recommend."</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EADAA9' }}></div>
                            <div>
                                <strong>Aria Kim</strong>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Adopted Peach Bear</div>
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
