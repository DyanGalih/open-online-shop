<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutIndexController extends Controller
{
    public function __invoke(Request $request, CheckoutService $checkoutService): Response|RedirectResponse
    {
        $cart = $request->session()->get('cart', []);

        if (empty($cart)) {
            return redirect('/')->with('error', 'Cart is empty');
        }

        $details = $checkoutService->getCheckoutDetails($cart);

        return Inertia::render('storefront/checkout', [
            'cartItems' => $details->cartItems,
            'total' => $details->total,
            'requiresShipping' => $details->requiresShipping,
        ]);
    }
}
