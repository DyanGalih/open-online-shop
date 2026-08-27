<?php

namespace App\Http\Controllers;

use App\Data\MidtransNotificationData;
use App\Services\OrderManagementService;
use Illuminate\Http\JsonResponse;

class MidtransController extends Controller
{
    public function __invoke(MidtransNotificationData $data, OrderManagementService $orderManagement): JsonResponse
    {
        $success = $orderManagement->processWebhookPayment(
            $data->orderId,
            $data->transactionStatus,
            $data->grossAmount,
            $data->signatureKey,
            $data->statusCode
        );

        if (! $success) {
            return response()->json(['message' => 'Invalid webhook payload or order not found'], 400);
        }

        return response()->json(['message' => 'Success']);
    }
}
