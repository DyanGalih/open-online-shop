<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('redirects unauthenticated guests to login when accessing order routes', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $this->get('/orders')->assertRedirect('/login');
    $this->get("/orders/{$order->id}")->assertRedirect('/login');
    $this->get("/orders/{$order->id}/download/{$product->id}")->assertRedirect('/login');
});

it('denies authenticated user access to another user order via policy', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $product = Product::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $owner->id,
    ]);

    $this->actingAs($otherUser)
        ->get("/orders/{$order->id}")
        ->assertForbidden();

    $this->actingAs($otherUser)
        ->get("/orders/{$order->id}/download/{$product->id}")
        ->assertForbidden();

    $fakeFile = UploadedFile::fake()->image('proof.jpg');
    $this->actingAs($otherUser)
        ->post("/orders/{$order->id}/payment-proof", [
            'paymentProof' => $fakeFile,
        ])
        ->assertForbidden();
});

it('allows order owner to view their order and download digital product file', function () {
    Storage::fake('private');

    $owner = User::factory()->create();

    $filePath = 'digital_products/sample.pdf';
    Storage::disk('private')->put($filePath, 'PDF Content');

    $product = Product::factory()->create([
        'is_digital' => true,
        'file_path' => $filePath,
    ]);

    $order = Order::factory()->create([
        'user_id' => $owner->id,
        'status' => 'paid',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'price' => $product->price,
        'quantity' => 1,
    ]);

    $this->actingAs($owner)
        ->get("/orders/{$order->id}")
        ->assertOk();

    $downloadResponse = $this->actingAs($owner)
        ->get("/orders/{$order->id}/download/{$product->id}");

    $downloadResponse->assertOk();
});
