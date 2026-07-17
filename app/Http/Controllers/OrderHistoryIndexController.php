<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\OrderService;

class OrderHistoryIndexController extends Controller
{
    public function __invoke(OrderService $orderService)
    {
        $orders = $orderService->getUserOrders(Auth::user());
        
        return Inertia::render('orders/index', [
            'orders' => $orders
        ]);
    }
}
