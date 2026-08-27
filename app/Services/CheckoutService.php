<?php

namespace App\Services;

use App\Data\CartItemDetailsData;
use App\Data\CheckoutData;
use App\Data\CheckoutDetailsData;
use App\Mail\CheckoutConfirmation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Spatie\LaravelData\DataCollection;

class CheckoutService
{
    public function __construct(
        private GuestRegistrationService $guestRegistration,
        private SignedUrlService $signedUrlService
    ) {}

    /** @param array<string, int> $cart */
    public function getCheckoutDetails(array $cart): CheckoutDetailsData
    {
        $products = Product::whereIn('id', array_keys($cart))->get();

        $total = 0;
        $requiresShipping = false;
        $items = [];

        foreach ($products as $product) {
            $qty = $cart[$product->id] ?? 0;
            $total += $product->price * $qty;
            if (! $product->is_digital) {
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
            cartItems: new DataCollection(CartItemDetailsData::class, $items),
            total: $total,
            requiresShipping: $requiresShipping
        );
    }

    /** @param array<string, int> $cart */
    public function processCheckout(CheckoutData $data, array $cart): Order
    {
        $user = Auth::user();

        if (! $user) {
            $registrationResult = $this->guestRegistration->registerGuest($data->email, $data->name);
            $user = $registrationResult['user'];

            // Only log in if the user account was genuinely created as new (prevents account takeover)
            if ($registrationResult['is_new']) {
                Auth::login($user);
            }
        }

        $products = Product::whereIn('id', array_keys($cart))->get();
        $total = 0;
        foreach ($products as $product) {
            $total += $product->price * $cart[$product->id];
        }

        $order = DB::transaction(function () use ($user, $data, $products, $cart, $total) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'session_key' => \Illuminate\Support\Str::random(40),
                'payment_due_at' => now()->addHour(),
                'payment_method' => $data->paymentMethod,
                'shipping_address' => $data->shippingAddress,
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

        // Dispatch queued checkout confirmation with 1-hour signed URL (FR-002, FR-008)
        $signedUrl = $this->signedUrlService->generateCheckoutLink($order);
        Mail::to($user->email)->queue(new CheckoutConfirmation($order, $signedUrl));

        return $order;
    }
}
