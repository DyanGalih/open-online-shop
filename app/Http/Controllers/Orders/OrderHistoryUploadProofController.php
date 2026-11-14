<?php

namespace App\Http\Controllers\Orders;

use App\Data\PaymentProofData;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\ManualPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class OrderHistoryUploadProofController extends Controller
{
    public function __invoke(PaymentProofData $data, Order $order, ManualPaymentService $manualPaymentService): RedirectResponse
    {
        Gate::authorize('view', $order);

        $path = $data->paymentProof->store('payment_proofs', 'private');

        if ($path === false) {
            return back()->with('error', 'Failed to upload payment proof.');
        }

        $manualPaymentService->submitProof($order, $path);

        return back()->with('success', 'Payment proof uploaded successfully.');
    }
}
