<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderManagementService;
use Illuminate\Http\RedirectResponse;

class AdminOrderApproveController extends Controller
{
    public function __invoke(string $id, OrderManagementService $orderManagement): RedirectResponse
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'awaiting_verification') {
            return back()->with('error', 'Order cannot be approved in current state.');
        }

        $orderManagement->markAsPaid($order);

        return back()->with('success', 'Order approved and invoice sent.');
    }
}
