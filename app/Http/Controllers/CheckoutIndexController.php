<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

use App\Services\CheckoutService;

class CheckoutIndexController extends Controller
{
    public function __invoke(Request $request, CheckoutService $checkoutService)
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
