<?php

namespace App\Services;

use App\Models\Order;

class OrderManagementService
{
    public function __construct(private InvoiceService $invoiceService) {}

    public function markAsPaid(Order $order): void
    {
        if ($order->status === 'paid') {
            return;
        }

        $order->update(['status' => 'paid']);
        $this->invoiceService->generateAndSend($order);
    }

    public function markAsFailed(Order $order): void
    {
        $order->update(['status' => 'failed']);
    }

    public function processWebhookPayment(string $orderId, string $status): bool
    {
        $order = Order::find($orderId);

        if (! $order) {
            return false;
        }

        if ($status === 'capture' || $status === 'settlement') {
            $this->markAsPaid($order);
        } elseif ($status === 'cancel' || $status === 'deny' || $status === 'expire') {
            $this->markAsFailed($order);
        }

        return true;
    }
}
