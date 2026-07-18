<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartRemoveController extends Controller
{
    public function __invoke(Request $request, string $product_id, CartService $cartService)
    {
        $cartService->removeProduct($request, $product_id);

        return redirect()->back()->with('success', 'Product removed from cart.');
    }
}
