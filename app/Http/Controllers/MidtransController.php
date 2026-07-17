<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Services\OrderManagementService;
use App\Data\MidtransNotificationData;

class MidtransController extends Controller
{
    public function __invoke(MidtransNotificationData $data, OrderManagementService $orderManagement)
    {
        $success = $orderManagement->processWebhookPayment($data->order_id, $data->transaction_status);

        if (!$success) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['message' => 'Success']);
    }
}
