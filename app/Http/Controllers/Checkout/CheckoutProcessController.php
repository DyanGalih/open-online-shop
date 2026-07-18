<?php

namespace App\Http\Controllers\Checkout;

use App\Data\CheckoutData;
use App\Http\Controllers\Controller;
use App\Services\CheckoutService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutProcessController extends Controller
{
    public function __invoke(CheckoutData $data, Request $request, CheckoutService $checkoutService, PaymentService $paymentService)
    {
        $cart = $request->session()->get('cart', []);

        if (empty($cart)) {
            return redirect('/')->with('error', 'Cart is empty');
        }

        $order = $checkoutService->processCheckout($data, $cart);

        $request->session()->forget('cart');

        if ($order->payment_method === 'midtrans') {
            $paymentUrl = $paymentService->createPayment($order);

            return Inertia::location($paymentUrl);
        }

        return redirect()->route('orders.show', $order->id)->with('success', 'Order created. Please upload payment proof.');
    }
}
