import { Head, Link } from '@inertiajs/react';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
];

export default function Dashboard({
    metrics,
}: {
    metrics: {
        dailySales: number;
        pendingOrders: number;
        lowStockProducts: number;
    };
}) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-3xl tracking-tight text-gray-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back! Here's what's happening with your store
                        today.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Daily Sales Card */}
                    <Card className="hover:shadow-soft relative overflow-hidden border-border bg-card transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Daily Sales
                            </CardTitle>
                            <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-950/20">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {formatCurrency(metrics.dailySales)}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span>Updated just now</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Orders Card */}
                    <Card className="hover:shadow-soft relative overflow-hidden border-border bg-card transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Orders
                            </CardTitle>
                            <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-950/20">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {metrics.pendingOrders}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Awaiting processing or verification
                            </p>
                        </CardContent>
                    </Card>

                    {/* Low Stock Products Card */}
                    <Card className="hover:shadow-soft relative overflow-hidden border-border bg-card transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Low Stock Products
                            </CardTitle>
                            <div className="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-950/20">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {metrics.lowStockProducts}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Items with less than 5 units left
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Welcome Banner */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Welcome Promo Card */}
                    <Card className="overflow-hidden border-orange-100 bg-[#FDF5F1] md:col-span-2 dark:border-border dark:bg-muted/20">
                        <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F5E6DF] px-2.5 py-0.5 text-xs font-semibold text-[#8C3F23] dark:bg-orange-950/30 dark:text-orange-400">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Store Optimization</span>
                                </div>
                                <h3 className="font-serif text-xl text-gray-900 dark:text-foreground">
                                    Grow Your Business with Pro Insights
                                </h3>
                                <p className="max-w-xl text-sm text-gray-600 dark:text-muted-foreground">
                                    Unlock advanced reports, customer behavior
                                    analytics, and marketing automation to take
                                    your Livia online shop to the next level.
                                </p>
                            </div>
                            <div>
                                <Button className="bg-[#8B9B82] text-white hover:bg-[#7A8A71]">
                                    Learn More & Upgrade
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Navigation Card */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Quick Actions
                            </CardTitle>
                            <CardDescription>
                                Commonly used management operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link href="/admin/orders">
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    <span>Manage Orders</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </Link>
                            <Link href="/admin/products">
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    <span>Manage Products</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </Link>
                            <Link href="/admin/categories">
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    <span>Manage Categories</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
