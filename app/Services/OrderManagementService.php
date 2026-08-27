<?php

namespace App\Services;

use App\Mail\OrderStatusUpdate;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;

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

    public function markAsShipped(Order $order): void
    {
        $order->update(['status' => 'shipped']);
        Mail::to($order->user->email)->queue(new OrderStatusUpdate($order, 'shipped'));
    }

    public function markAsDelivered(Order $order): void
    {
        $order->update(['status' => 'delivered']);
        Mail::to($order->user->email)->queue(new OrderStatusUpdate($order, 'delivered'));
    }

    public function processWebhookPayment(string $orderId, string $status, ?int $grossAmount = null, ?string $signatureKey = null, ?string $statusCode = null): bool
    {
        $order = Order::find($orderId);

        if (! $order) {
            return false;
        }

        // Verify SHA-512 signature key if provided
        $serverKey = config('services.midtrans.server_key');
        if ($serverKey && $signatureKey && $statusCode && $grossAmount !== null) {
            $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);
            if (! hash_equals($expectedSignature, $signatureKey)) {
                return false;
            }
        }

        // Verify gross amount matches if provided
        if ($grossAmount !== null && (int) $grossAmount !== (int) $order->total_amount) {
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
