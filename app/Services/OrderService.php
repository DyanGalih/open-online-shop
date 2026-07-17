<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;

class OrderService
{
    public function getUserOrders($user): Collection
    {
        return $user->orders()->with('items.product')->latest()->get();
    }

    public function getUserOrder($user, string $id): Order
    {
        return $user->orders()->with('items.product')->findOrFail($id);
    }

    public function getDigitalProductFile($user, string $orderId, string $productId): array
    {
        $order = $user->orders()->with('items')->findOrFail($orderId);

        if ($order->status !== 'paid') {
            abort(403, 'Order is not paid yet.');
        }

        $item = $order->items->where('product_id', $productId)->first();

        if (!$item) {
            abort(404, 'Product not found in this order.');
        }

        $product = \App\Models\Product::findOrFail($productId);

        if (!$product->is_digital || !$product->file_path) {
            abort(404, 'Digital product file not found.');
        }

        return [
            'path' => $product->file_path,
            'name' => $product->name . '.' . pathinfo($product->file_path, PATHINFO_EXTENSION)
        ];
    }
}
