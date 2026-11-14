<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;

class OrderService
{
    /** @return Collection<int, Order> */
    public function getOrders(User $user): Collection
    {
        return $user->orders()->with('items.product')->latest()->get();
    }

    public function loadOrderDetails(Order $order, User $user): Order
    {
        Gate::authorize('view', $order);

        return $order->load([
            'items.product',
            'items.product.reviews' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            },
        ]);
    }

    public function getOrder(string $id, User $user): Order
    {
        $order = Order::with('items.product')->findOrFail($id);

        return $this->loadOrderDetails($order, $user);
    }

    /** @return array<string, string> */
    public function getDigitalProductFile(User $user, Order $order, Product $product): array
    {
        Gate::authorize('view', $order);

        if ($order->status !== 'paid') {
            abort(403, 'Order is not paid yet.');
        }

        $item = $order->items->where('product_id', $product->id)->first();

        if (! $item) {
            abort(404, 'Product not found in this order.');
        }

        if (! $product->is_digital || ! $product->file_path) {
            abort(404, 'Digital product file not found.');
        }

        return [
            'path' => $product->file_path,
            'name' => $product->name.'.'.pathinfo($product->file_path, PATHINFO_EXTENSION),
        ];
    }
}
