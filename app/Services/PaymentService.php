<?php

namespace App\Services;

use App\Models\Order;

class PaymentService
{
    public function createPayment(Order $order): string
    {
        // Mocking midtrans snap url generation
        return 'https://app.sandbox.midtrans.com/snap/v2/vtweb/mocked-token-for-order-' . $order->id;
    }
}
