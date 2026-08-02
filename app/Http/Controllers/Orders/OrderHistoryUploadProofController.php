<?php

namespace App\Http\Controllers\Orders;

use App\Data\PaymentProofData;
use App\Http\Controllers\Controller;
use App\Services\ManualPaymentService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class OrderHistoryUploadProofController extends Controller
{
    public function __invoke(\Illuminate\Http\Request $request, PaymentProofData $data, string $id, ManualPaymentService $manualPaymentService, OrderService $orderService): RedirectResponse
    {
        $order = $orderService->getOrder($id, Auth::user(), $request->input('email'), $request->input('session_key'));

        $path = $data->paymentProof->store('payment_proofs', 'private');

        if ($path === false) {
            return back()->with('error', 'Failed to upload payment proof.');
        }

        $manualPaymentService->submitProof($order, $path);

        return back()->with('success', 'Payment proof uploaded successfully.');
    }
}
