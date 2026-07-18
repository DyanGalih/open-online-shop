import { Head, useForm } from '@inertiajs/react';
import { Tags, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function Index({ categories }: { categories: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            description: '',
        });

    const handleCreateOpen = () => {
        clearErrors();
        setMode('create');
        setEditingCategory(null);
        reset();
        setIsOpen(true);
    };

    const handleEditOpen = (category: any) => {
        clearErrors();
        setMode('edit');
        setEditingCategory(category);
        setData({
            name: category.name || '',
            description: category.description || '',
        });
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post('/admin/categories', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            <Head title="Categories Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tags className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Categories
                        </h1>
                    </div>
                    <Button onClick={handleCreateOpen}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Category
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Groups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No categories found.
                                </p>
                            </div>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3">
                                                Category Name
                                            </th>
                                            <th className="px-4 py-3">Slug</th>
                                            <th className="px-4 py-3 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {categories.map((cat: any) => (
                                            <tr
                                                key={cat.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-4 font-medium">
                                                    {cat.name}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {cat.slug}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditOpen(cat)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Slide-over Sheet (Drawer) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent
                    side="right"
                    className="flex h-full flex-col justify-between p-0 sm:max-w-md"
                >
                    <div>
                        <SheetHeader className="border-b border-gray-100 px-6 py-5">
                            <SheetTitle className="font-serif text-xl text-gray-900">
                                {mode === 'create'
                                    ? 'Create Category'
                                    : 'Edit Category'}
                            </SheetTitle>
                            <SheetDescription>
                                {mode === 'create'
                                    ? 'Add a new category group to organize your products.'
                                    : 'Modify the details of your existing product category.'}
                            </SheetDescription>
                        </SheetHeader>

                        <form
                            onSubmit={submit}
                            id="categoryForm"
                            className="space-y-6 p-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter category name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Enter category description"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>

                    <SheetFooter className="mt-auto flex flex-row items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                        <SheetClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-lg border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            form="categoryForm"
                            disabled={processing}
                            className="rounded-lg bg-[#8B9B82] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#7A8A71] hover:text-white"
                        >
                            {mode === 'create'
                                ? 'Create Category'
                                : 'Save Changes'}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
