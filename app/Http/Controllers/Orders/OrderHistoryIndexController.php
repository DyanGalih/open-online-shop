<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

use App\Data\OrderListRequestData;

class OrderHistoryIndexController extends Controller
{
    public function __invoke(OrderListRequestData $data, OrderService $orderService): Response
    {
        $orders = $orderService->getOrders(Auth::user(), $data->email, $data->session_key);

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'guest_email' => $data->email,
            'guest_session_key' => $data->session_key,
        ]);
    }
}
