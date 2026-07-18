<?php

use App\Models\Product;
use App\Services\CheckoutService;

it('builds checkout details for products with ULID identifiers', function () {
    $product = Product::factory()->create([
        'price' => 2500,
        'is_digital' => false,
    ]);

    $details = app(CheckoutService::class)->getCheckoutDetails([
        $product->id => 2,
    ]);

    $item = $details->cartItems->first();

    expect($item->id)->toBe($product->id)
        ->and($item->quantity)->toBe(2)
        ->and($details->total)->toBe(5000)
        ->and($details->requiresShipping)->toBeTrue();
});
