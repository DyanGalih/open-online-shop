<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Data\CheckoutData;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Data\CheckoutDetailsData;
use App\Data\CartItemDetailsData;

class CheckoutService
{
    public function __construct(
        private GuestRegistrationService $guestRegistration
    ) {}

    public function getCheckoutDetails(array $cart): CheckoutDetailsData
    {
        $products = Product::whereIn('id', array_keys($cart))->get();
        
        $total = 0;
        $requiresShipping = false;
        $items = [];
        
        foreach ($products as $product) {
            $qty = $cart[$product->id] ?? 0;
            $total += $product->price * $qty;
            if (!$product->is_digital) {
                $requiresShipping = true;
            }
            $items[] = new CartItemDetailsData(
                id: $product->id,
                name: $product->name,
                price: $product->price,
                quantity: $qty
            );
        }

        return new CheckoutDetailsData(
            cartItems: CartItemDetailsData::collect($items),
            total: $total,
            requiresShipping: $requiresShipping
        );
    }

    public function processCheckout(CheckoutData $data, array $cart): Order
    {
        $user = Auth::user();
        
        if (!$user) {
            $user = $this->guestRegistration->registerGuest($data->email, $data->name);
            Auth::login($user);
        }

        $products = Product::whereIn('id', array_keys($cart))->get();
        $total = 0;
        foreach ($products as $product) {
            $total += $product->price * $cart[$product->id];
        }

        return DB::transaction(function () use ($user, $data, $products, $cart, $total) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'payment_method' => $data->payment_method,
                'shipping_address' => $data->shipping_address,
                'total_amount' => $total,
            ]);

            foreach ($products as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $cart[$product->id],
                ]);
            }
            
            return $order;
        });
    }
}
