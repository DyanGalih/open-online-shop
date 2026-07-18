<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class OrderService
{
    /** @return Collection<int, Order> */
    public function getUserOrders(User $user): Collection
    {
        return $user->orders()->with('items.product')->latest()->get();
    }

    public function getUserOrder(User $user, string $id): Order
    {
        return $user->orders()->with(['items.product.reviews' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])->findOrFail($id);
    }

    /** @return array<string, string> */
    public function getDigitalProductFile(User $user, string $orderId, string $productId): array
    {
        $order = $user->orders()->with('items')->findOrFail($orderId);

        if ($order->status !== 'paid') {
            abort(403, 'Order is not paid yet.');
        }

        $item = $order->items->where('product_id', $productId)->first();

        if (! $item) {
            abort(404, 'Product not found in this order.');
        }

        $product = Product::findOrFail($productId);

        if (! $product->is_digital || ! $product->file_path) {
            abort(404, 'Digital product file not found.');
        }

        return [
            'path' => $product->file_path,
            'name' => $product->name.'.'.pathinfo($product->file_path, PATHINFO_EXTENSION),
        ];
    }
}
