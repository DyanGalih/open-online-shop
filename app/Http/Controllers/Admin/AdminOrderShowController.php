<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderShowController extends Controller
{
    public function __invoke(string $id): Response
    {
        $order = Order::with(['user', 'items'])->findOrFail($id);

        $paymentProofUrl = $order->payment_evidence_path
            ? Storage::disk('private')->url($order->payment_evidence_path)
            : null;

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'paymentProofUrl' => $paymentProofUrl,
        ]);
    }
}
