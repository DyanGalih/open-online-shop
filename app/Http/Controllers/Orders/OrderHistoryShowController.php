<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

use App\Data\OrderListRequestData;

class OrderHistoryShowController extends Controller
{
    public function __invoke(string $id, OrderListRequestData $data, OrderService $orderService): Response
    {
        $order = $orderService->getOrder($id, Auth::user(), $data->email, $data->session_key);

        return Inertia::render('orders/show', [
            'order' => $order,
            'guest_email' => $data->email,
            'guest_session_key' => $data->session_key,
        ]);
    }
}
