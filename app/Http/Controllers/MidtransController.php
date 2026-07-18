<?php

namespace App\Http\Controllers;

use App\Data\MidtransNotificationData;
use App\Services\OrderManagementService;

class MidtransController extends Controller
{
    public function __invoke(MidtransNotificationData $data, OrderManagementService $orderManagement)
    {
        $success = $orderManagement->processWebhookPayment($data->orderId, $data->transactionStatus);

        if (! $success) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['message' => 'Success']);
    }
}
