<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryIndexController extends Controller
{
    public function __invoke(OrderService $orderService): Response
    {
        $orders = $orderService->getUserOrders(Auth::user());

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }
}
