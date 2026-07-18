<?php

namespace App\Http\Controllers\Cart;

use App\Data\CartAddData;
use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CartAddController extends Controller
{
    public function __invoke(CartAddData $data, Request $request, CartService $cartService): RedirectResponse
    {
        $cartService->addProduct($request, $data);

        return redirect()->back()->with('success', 'Product added to cart.');
    }
}
