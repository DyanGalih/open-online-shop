<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\OrderService;

class OrderHistoryShowController extends Controller
{
    public function __invoke(string $id, OrderService $orderService)
    {
        $order = $orderService->getUserOrder(Auth::user(), $id);
        
        return Inertia::render('orders/show', [
            'order' => $order
        ]);
    }
}
