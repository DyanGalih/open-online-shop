<?php

namespace App\Http\Controllers;

use App\Data\CartAddData;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartAddController extends Controller
{
    public function __invoke(CartAddData $data, Request $request, CartService $cartService)
    {
        $cartService->addProduct($request, $data);
        return redirect()->back()->with('success', 'Product added to cart.');
    }
}
