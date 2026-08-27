<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => 'pending',
            'session_key' => Str::random(40),
            'payment_method' => 'manual',
            'shipping_address' => $this->faker->address(),
            'total_amount' => $this->faker->numberBetween(1000, 50000),
            'payment_due_at' => now()->addHour(),
        ];
    }
}
