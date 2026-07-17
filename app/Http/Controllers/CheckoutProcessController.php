<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Data\CheckoutData;
use App\Services\CheckoutService;
use App\Services\PaymentService;

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
