import { Menu } from 'antd';
import React from 'react';

interface CategoryListProps {
    categories: Array<{ id: number; name: string, slug: string }>;
}

export default function CategoryList({ categories }: CategoryListProps) {
    const items = categories.map((c) => ({
        key: c.id.toString(),
        label: c.name,
    }));

    return (
        <Menu
            mode="inline"
            items={items}
            style={{ height: '100%', borderRight: 0 }}
        />
    );
}
