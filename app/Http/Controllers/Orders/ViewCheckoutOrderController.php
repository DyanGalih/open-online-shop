<?php

namespace App\Http\Controllers\Orders;

use App\Data\CheckoutOrderViewData;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\SignedUrlService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewCheckoutOrderController extends Controller
{
    public function __invoke(Request $request, string $orderId, SignedUrlService $signedUrlService): Response
    {
        if (! $signedUrlService->verifySignature($request)) {
            abort(403, 'Invalid or expired order confirmation link.');
        }

        $order = Order::with('items')->findOrFail($orderId);

        if ($order->link_consumed_at !== null) {
            abort(403, 'This single-use link has already been viewed. Please sign in to access your order history.');
        }

        $order->update(['link_consumed_at' => now()]);

        return Inertia::render('orders/checkout-view', [
            'order' => CheckoutOrderViewData::fromModel($order),
        ]);
    }
}
