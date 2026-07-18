<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function __invoke(string $orderId, string $productId, Request $request, OrderService $orderService)
    {
        $fileDetails = $orderService->getDigitalProductFile($request->user(), $orderId, $productId);

        return Storage::disk('private')->download($fileDetails['path'], $fileDetails['name']);
    }
}
