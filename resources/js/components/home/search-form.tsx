import { Form, Input, Select, Button } from 'antd';
import React from 'react';

const { Option } = Select;

interface SearchFormProps {
    categories: Array<{ id: number; name: string }>;
    onSearch: (values: any) => void;
}

export default function SearchForm({ categories, onSearch }: SearchFormProps) {
    return (
        <Form onFinish={onSearch} style={{ marginBottom: 20 }}>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                <Form.Item name="search" style={{ margin: 0, flex: 1 }}>
                    <Input
                        placeholder="Search products..."
                        allowClear
                        size="large"
                        style={{ borderRadius: 12 }}
                    />
                </Form.Item>
                <div className="flex w-full gap-3 md:w-auto md:gap-4">
                    <Form.Item name="categoryId" style={{ margin: 0, flex: 1 }}>
                        <Select
                            placeholder="Category"
                            size="large"
                            allowClear
                            style={{ width: '100%' }}
                        >
                            {categories.map((c) => (
                                <Option key={c.id} value={c.id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="sort" style={{ margin: 0, flex: 1 }}>
                        <Select
                            placeholder="Sort By"
                            size="large"
                            style={{ width: '100%' }}
                        >
                            <Option value="latest">Latest</Option>
                            <Option value="price_asc">
                                Price: Low to High
                            </Option>
                            <Option value="price_desc">
                                Price: High to Low
                            </Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item
                    style={{ margin: 0, width: '100%' }}
                    className="md:!w-auto"
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                            borderRadius: 12,
                            background: '#3C3542',
                            width: '100%',
                        }}
                    >
                        Search
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
}
