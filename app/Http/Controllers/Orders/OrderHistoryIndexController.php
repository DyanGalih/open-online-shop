<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryIndexController extends Controller
{
    public function __invoke(Request $request, OrderService $orderService): Response
    {
        $orders = $orderService->getOrders($request->user());

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }
}
