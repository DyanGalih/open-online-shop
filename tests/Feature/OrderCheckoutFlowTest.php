<?php

use App\Data\CheckoutData;
use App\Mail\CheckoutConfirmation;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CheckoutService;
use App\Services\SignedUrlService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

it('creates guest checkout order and queues signed confirmation email without auto-logging in existing user (ATO prevention)', function () {
    Mail::fake();

    $existingUser = User::factory()->create([
        'email' => 'victim@example.com',
        'password' => bcrypt('password123'),
    ]);

    $product = Product::factory()->create([
        'price' => 1000,
    ]);

    $checkoutData = new CheckoutData(
        name: 'Guest Attacker',
        email: 'victim@example.com',
        paymentMethod: 'manual',
        shippingAddress: '123 Test St'
    );

    $checkoutService = app(CheckoutService::class);
    $order = $checkoutService->processCheckout($checkoutData, [$product->id => 1]);

    expect($order->user_id)->toBe($existingUser->id)
        ->and($order->payment_due_at)->not->toBeNull()
        ->and(Auth::check())->toBeFalse(); // Must NOT be logged in as victim (SEC-001)

    Mail::assertQueued(CheckoutConfirmation::class, function ($mail) use ($order) {
        return $mail->order->id === $order->id;
    });
});

it('allows guest to view just-placed order via signed URL snapshot exactly once (single-use replay rejection)', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $signedUrlService = app(SignedUrlService::class);
    $signedUrl = $signedUrlService->generateCheckoutLink($order);

    // 1. First open: Valid
    $response = $this->get($signedUrl);
    $response->assertOk();

    $order->refresh();
    expect($order->link_consumed_at)->not->toBeNull();

    // 2. Replay attempt: 403 Forbidden
    $replayResponse = $this->get($signedUrl);
    $replayResponse->assertForbidden();

    // 3. Tampered signature: 403 Forbidden
    $tamperedUrl = $signedUrl.'tampered';
    $tamperedResponse = $this->get($tamperedUrl);
    $tamperedResponse->assertForbidden();
});
