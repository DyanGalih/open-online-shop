import { Card, Row, Col, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;
const { Meta } = Card;

interface Product {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
}

interface PersonalizedWidgetProps {
    recentlyViewed: Product[];
    recommended: Product[];
    hasRecentOrder: boolean;
}

export default function PersonalizedWidget({ recentlyViewed, recommended, hasRecentOrder }: PersonalizedWidgetProps) {
    if (recentlyViewed.length === 0 && recommended.length === 0 && !hasRecentOrder) {
        return null;
    }

    return (
        <div style={{ marginBottom: 32, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <Title level={4}>Welcome Back!</Title>
            
            {hasRecentOrder && (
                <div style={{ marginBottom: 16 }}>
                    <a href="/orders/recent">Track your recent order</a>
                </div>
            )}

            {recentlyViewed.length > 0 && (
                <>
                    <Title level={5}>Recently Viewed</Title>
                    <Row gutter={[16, 16]}>
                        {recentlyViewed.map((p) => (
                            <Col span={8} key={p.id}>
                                <Card size="small" hoverable cover={<img alt={p.title} src={p.image_url || 'https://placehold.co/400x300'} />}>
                                    <Meta title={p.title} description={`$${p.price.toFixed(2)}`} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
}
