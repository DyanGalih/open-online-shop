<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class OrderService
{
    /** @return Collection<int, Order> */
    public function getOrders(?User $user = null, ?string $email = null, ?string $sessionKey = null): Collection
    {
        if ($user) {
            return $user->orders()->with('items.product')->latest()->get();
        }

        if ($email && $sessionKey) {
            return Order::whereHas('user', function ($query) use ($email) {
                $query->where('email', $email);
            })->where('session_key', $sessionKey)->with('items.product')->latest()->get();
        }

        abort(403, 'Unauthorized.');
    }

    public function getOrder(string $id, ?User $user = null, ?string $email = null, ?string $sessionKey = null): Order
    {
        $query = Order::with('items.product');

        if ($user) {
            $query->where('user_id', $user->id)
                  ->with(['items.product.reviews' => function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  }]);
        } elseif ($email && $sessionKey) {
            $query->whereHas('user', function ($q) use ($email) {
                $q->where('email', $email);
            })->where('session_key', $sessionKey);
        } else {
            abort(403, 'Unauthorized.');
        }

        return $query->findOrFail($id);
    }

    /** @return array<string, string> */
    public function getDigitalProductFile(?User $user, string $orderId, string $productId, ?string $email = null, ?string $sessionKey = null): array
    {
        $order = $this->getOrder($orderId, $user, $email, $sessionKey);

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
