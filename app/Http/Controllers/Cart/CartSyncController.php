<?php

namespace App\Http\Controllers\Cart;

use App\Data\CartSyncData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartSyncController extends Controller
{
    /**
     * Sync the frontend localStorage cart to the backend session,
     * so the checkout page can read it.
     */
    public function __invoke(CartSyncData $data, Request $request): JsonResponse
    {
        $cart = [];
        foreach ($data->items as $item) {
            $cart[$item->productId] = $item->quantity;
        }

        $request->session()->put('cart', $cart);

        return response()->json(['ok' => true]);
    }
}
