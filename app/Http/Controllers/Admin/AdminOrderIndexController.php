<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Order;

class AdminOrderIndexController extends Controller
{
    public function __invoke()
    {
        $orders = Order::with('user')->latest()->get();
        return Inertia::render('admin/orders/index', [
            'orders' => $orders
        ]);
    }
}
