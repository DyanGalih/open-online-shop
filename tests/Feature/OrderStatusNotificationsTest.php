<?php

use App\Mail\OrderStatusUpdate;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderManagementService;
use Illuminate\Support\Facades\Mail;

it('queues OrderStatusUpdate email when status is marked as shipped or delivered', function () {
    Mail::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
    ]);

    $service = app(OrderManagementService::class);

    $service->markAsShipped($order);
    expect($order->fresh()->status)->toBe('shipped');
    Mail::assertQueued(OrderStatusUpdate::class, fn ($mail) => $mail->newStatus === 'shipped');

    $service->markAsDelivered($order);
    expect($order->fresh()->status)->toBe('delivered');
    Mail::assertQueued(OrderStatusUpdate::class, fn ($mail) => $mail->newStatus === 'delivered');
});

it('processes webhook payment with valid signature and transitions order to paid', function () {
    Mail::fake();
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $statusCode = '200';
    $grossAmount = '50000';
    $signature = hash('sha512', $order->id.$statusCode.$grossAmount.'secret-server-key');

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'settlement',
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signature,
    ]);

    $response->assertOk();
    expect($order->fresh()->status)->toBe('paid');
});

it('rejects forged webhook notifications with invalid signature', function () {
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'settlement',
        'status_code' => '200',
        'gross_amount' => '50000',
        'signature_key' => 'invalid-signature-hash',
    ]);

    $response->assertBadRequest();
    expect($order->fresh()->status)->toBe('pending');
});

it('rejects forged webhook notifications when signature parameters are omitted', function () {
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'capture',
    ]);

    $response->assertUnprocessable();
    expect($order->fresh()->status)->toBe('pending');
});

it('rejects webhook notifications when gross amount mismatches order total', function () {
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $statusCode = '200';
    $tamperedAmount = '1000';
    $signature = hash('sha512', $order->id.$statusCode.$tamperedAmount.'secret-server-key');

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'settlement',
        'status_code' => $statusCode,
        'gross_amount' => $tamperedAmount,
        'signature_key' => $signature,
    ]);

    $response->assertBadRequest();
    expect($order->fresh()->status)->toBe('pending');
});

it('processes webhook payment with decimal gross amount string and valid signature', function () {
    Mail::fake();
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $statusCode = '200';
    $grossAmount = '50000.00';
    $signature = hash('sha512', $order->id.$statusCode.$grossAmount.'secret-server-key');

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'settlement',
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'signature_key' => $signature,
    ]);

    $response->assertOk();
    expect($order->fresh()->status)->toBe('paid');
});

it('rejects webhook notifications when gross amount has fractional difference from order total', function () {
    config(['services.midtrans.server_key' => 'secret-server-key']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'total_amount' => 50000,
    ]);

    $statusCode = '200';
    $tamperedAmount = '49999.60';
    $signature = hash('sha512', $order->id.$statusCode.$tamperedAmount.'secret-server-key');

    $response = $this->postJson('/webhooks/midtrans', [
        'order_id' => $order->id,
        'transaction_status' => 'settlement',
        'status_code' => $statusCode,
        'gross_amount' => $tamperedAmount,
        'signature_key' => $signature,
    ]);

    $response->assertBadRequest();
    expect($order->fresh()->status)->toBe('pending');
});
