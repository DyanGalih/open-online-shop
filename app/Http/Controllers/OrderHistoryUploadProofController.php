<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Data\PaymentProofData;
use App\Services\ManualPaymentService;
use App\Services\OrderService;

class OrderHistoryUploadProofController extends Controller
{
    public function __invoke(PaymentProofData $data, string $id, ManualPaymentService $manualPaymentService, OrderService $orderService)
    {
        $order = $orderService->getUserOrder(Auth::user(), $id);
        
        $path = $data->payment_proof->store('payment_proofs', 'private');
        
        $manualPaymentService->submitProof($order, $path);

        return back()->with('success', 'Payment proof uploaded successfully.');
    }
}
