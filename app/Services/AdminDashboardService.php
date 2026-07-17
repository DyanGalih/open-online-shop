<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;

class AdminDashboardService
{
    public function getMetrics(): array
    {
        $today = Carbon::today();
        
        $dailySales = Order::where('status', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total_amount');
            
        $pendingOrders = Order::where('status', 'pending')
            ->orWhere('status', 'awaiting_verification')
            ->count();
            
        $lowStockProducts = Product::where('is_digital', false)
            ->where('stock', '<', 5)
            ->count();

        return [
            'dailySales' => $dailySales,
            'pendingOrders' => $pendingOrders,
            'lowStockProducts' => $lowStockProducts,
        ];
    }
}
