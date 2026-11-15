<?php

use App\Jobs\DispatchWebhookJob;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

test('unauthenticated api requests are rejected with 401', function () {
    $response = $this->getJson('/api/v1/products');

    $response->assertUnauthorized();
});

test('authenticated api requests return active products', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $category = Category::create([
        'name' => 'API Gear',
        'slug' => 'api-gear',
    ]);

    Product::create([
        'category_id' => $category->id,
        'name' => 'API Product',
        'slug' => 'api-product',
        'description' => 'Tested via API',
        'price' => 10000,
        'status' => 'active',
        'stock' => 5,
        'is_digital' => false,
    ]);

    $response = $this->getJson('/api/v1/products');

    $response->assertOk()
        ->assertJsonFragment(['name' => 'API Product']);
});

test('dispatch webhook job calculates valid hmac signature header', function () {
    Http::fake([
        'https://example.com/webhook' => Http::response(['status' => 'received'], 200),
    ]);

    $payload = ['event' => 'order.paid', 'order_id' => '01test123'];
    $secret = 'super-secret-webhook-key';
    $expectedSignature = hash_hmac('sha256', json_encode($payload, JSON_THROW_ON_ERROR), $secret);

    $job = new DispatchWebhookJob('https://example.com/webhook', $payload, $secret);
    $job->handle();

    Http::assertSent(function ($request) use ($expectedSignature) {
        return $request->url() === 'https://example.com/webhook'
            && $request->hasHeader('X-Webhook-Signature', $expectedSignature);
    });
});

test('release expired reservations command cancels stale pending orders and restores stock', function () {
    $user = User::factory()->create();
    $category = Category::create(['name' => 'Phones', 'slug' => 'phones']);

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Flagship Phone',
        'slug' => 'flagship-phone',
        'description' => 'Flagship',
        'price' => 99900,
        'status' => 'active',
        'stock' => 3,
        'is_digital' => false,
    ]);

    // Create stale pending order created 2 hours ago
    $staleOrder = Order::create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 99900,
    ]);
    $staleOrder->created_at = Carbon::now()->subHours(2);
    $staleOrder->save();

    OrderItem::create([
        'order_id' => $staleOrder->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'price' => 99900,
    ]);

    $this->artisan('inventory:release-expired --hours=1')
        ->assertSuccessful();

    $staleOrder->refresh();
    expect($staleOrder->status)->toBe('cancelled');

    $product->refresh();
    expect($product->stock)->toBe(5); // 3 original + 2 restored
});
