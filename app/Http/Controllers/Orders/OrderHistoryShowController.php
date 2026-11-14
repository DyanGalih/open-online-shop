<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryShowController extends Controller
{
    public function __invoke(Order $order, Request $request, OrderService $orderService): Response
    {
        Gate::authorize('view', $order);

        $order = $orderService->loadOrderDetails($order, $request->user());

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }
}
