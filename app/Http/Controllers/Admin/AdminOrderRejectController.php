<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderManagementService;

class AdminOrderRejectController extends Controller
{
    public function __invoke(string $id, OrderManagementService $orderManagement)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status !== 'awaiting_verification') {
            return back()->with('error', 'Order cannot be rejected in current state.');
        }

        $orderManagement->markAsFailed($order);

        return back()->with('success', 'Order rejected.');
    }
}
