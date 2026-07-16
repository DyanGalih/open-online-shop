import { Card, Row, Col } from 'antd';
import React from 'react';

const { Meta } = Card;

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    image_url: string | null;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <Row gutter={[16, 16]}>
            {products.map((p) => (
                <Col xs={24} sm={12} md={6} lg={4} xl={4} key={p.id}>
                    <Card
                        hoverable
                        cover={
                            p.image_url ? (
                                <img alt={p.title} src={p.image_url} style={{ height: 200, objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: 200, background: '#F8F5FF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 64, borderRadius: '8px 8px 0 0' }}>
                                    🧸
                                </div>
                            )
                        }
                    >
                        <Meta title={p.title} description={`$${p.price.toFixed(2)}`} />
                    </Card>
                </Col>
            ))}
            {products.length === 0 && (
                <Col span={24}>
                    <p style={{ textAlign: 'center' }}>No products found.</p>
                </Col>
            )}
        </Row>
    );
}
