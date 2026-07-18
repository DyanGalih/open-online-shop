<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderIndexController extends Controller
{
    public function __invoke(): Response
    {
        $orders = Order::with('user')->latest()->get();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }
}
