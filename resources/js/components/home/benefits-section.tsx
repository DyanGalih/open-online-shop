import { Row, Col, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

export default function BenefitsSection() {
    return (
        <div style={{ background: '#F5F8FF' }}>
            <div className="!px-4 md:!px-12" style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div id="benefits" style={{ padding: '60px 0' }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <div style={{ background: '#FDF7F7', width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>🌿</div>
                        <Title level={4}>Organic Velvet Cotton</Title>
                        <p style={{ color: '#6b7280' }}>Responsibly grown natural fibers that make every single embrace cozy, cloud-soft, and hypoallergenic.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <div style={{ background: '#F2F7FC', width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>☁️</div>
                        <Title level={4}>Hypoallergenic Fill</Title>
                        <p style={{ color: '#6b7280' }}>Perfect for kids, infants, and dust-allergy sensitive snugglers. Entirely lint-free material.</p>
                    </div>
                </Col>
                <Col xs={24} md={8}>
                    <div style={{ background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                        <div style={{ background: '#FDFBF5', width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>🎁</div>
                        <Title level={4}>Delight Gifting Packs</Title>
                        <p style={{ color: '#6b7280' }}>Every single doll includes a beautiful Adoption Registry card and secure recycled keepsake packaging.</p>
                    </div>
                </Col>
            </Row>
                </div>
            </div>
        </div>
    );
}
