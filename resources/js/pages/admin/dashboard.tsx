import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    DollarSign, 
    ShoppingCart, 
    AlertTriangle, 
    ArrowRight, 
    TrendingUp,
    Sparkles
} from 'lucide-react';
import React from 'react';
import { formatCurrency } from '@/lib/currency';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
];

export default function Dashboard({ metrics }: { metrics: { dailySales: number; pendingOrders: number; lowStockProducts: number } }) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-serif tracking-tight text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Daily Sales Card */}
                    <Card className="relative overflow-hidden transition-all hover:shadow-soft border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Sales</CardTitle>
                            <div className="p-2 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-lg">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {formatCurrency(metrics.dailySales)}
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Updated just now</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Orders Card */}
                    <Card className="relative overflow-hidden transition-all hover:shadow-soft border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                            <div className="p-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-lg">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {metrics.pendingOrders}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Awaiting processing or verification</p>
                        </CardContent>
                    </Card>

                    {/* Low Stock Products Card */}
                    <Card className="relative overflow-hidden transition-all hover:shadow-soft border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Products</CardTitle>
                            <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-lg">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight text-foreground">
                                {metrics.lowStockProducts}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Items with less than 5 units left</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions & Welcome Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Welcome Promo Card */}
                    <Card className="md:col-span-2 bg-[#FDF5F1] dark:bg-muted/20 border-orange-100 dark:border-border overflow-hidden">
                        <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5E6DF] text-[#8C3F23] dark:bg-orange-950/30 dark:text-orange-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Store Optimization</span>
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 dark:text-foreground">Grow Your Business with Pro Insights</h3>
                                <p className="text-sm text-gray-600 dark:text-muted-foreground max-w-xl">
                                    Unlock advanced reports, customer behavior analytics, and marketing automation to take your Livia online shop to the next level.
                                </p>
                            </div>
                            <div>
                                <Button className="bg-[#8B9B82] hover:bg-[#7A8A71] text-white">
                                    Learn More & Upgrade
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Navigation Card */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>Commonly used management operations</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link href="/admin/orders">
                                <Button variant="outline" className="w-full justify-between">
                                    <span>Manage Orders</span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </Link>
                            <Link href="/admin/products">
                                <Button variant="outline" className="w-full justify-between">
                                    <span>Manage Products</span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </Link>
                            <Link href="/admin/categories">
                                <Button variant="outline" className="w-full justify-between">
                                    <span>Manage Categories</span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
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
