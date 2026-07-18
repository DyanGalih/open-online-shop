<?php

namespace App\Services;

use App\Data\CartAddData;
use Illuminate\Http\Request;

class CartService
{
    public function addProduct(Request $request, CartAddData $data): void
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$data->productId])) {
            $cart[$data->productId] += $data->quantity;
        } else {
            $cart[$data->productId] = $data->quantity;
        }

        $request->session()->put('cart', $cart);
    }

    public function removeProduct(Request $request, string $productId): void
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
        }

        $request->session()->put('cart', $cart);
    }
}
