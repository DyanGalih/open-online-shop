<?php

namespace App\Services;

use App\Models\Order;

class ManualPaymentService
{
    public function submitProof(Order $order, string $path): void
    {
        $order->update([
            'payment_evidence_path' => $path,
            'status' => 'awaiting_verification',
        ]);
    }
}
