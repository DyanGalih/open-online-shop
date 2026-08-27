<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

it('cancels past-due pending orders and leaves valid orders pending', function () {
    $user = User::factory()->create();

    $expiredOrder = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_due_at' => now()->subMinutes(10),
    ]);

    $activeOrder = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_due_at' => now()->addMinutes(45),
    ]);

    $paidOrder = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'paid',
        'payment_due_at' => now()->subMinutes(10),
    ]);

    Artisan::call('orders:cancel-expired');

    expect($expiredOrder->fresh()->status)->toBe('cancelled')
        ->and($activeOrder->fresh()->status)->toBe('pending')
        ->and($paidOrder->fresh()->status)->toBe('paid');
});
