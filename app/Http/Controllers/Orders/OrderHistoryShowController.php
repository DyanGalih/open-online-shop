<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryShowController extends Controller
{
    public function __invoke(string $id, OrderService $orderService): Response
    {
        $order = $orderService->getUserOrder(Auth::user(), $id);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }
}
