<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

use App\Services\OrderService;

class DownloadController extends Controller
{
    public function __invoke(string $orderId, string $productId, Request $request, OrderService $orderService)
    {
        $fileDetails = $orderService->getDigitalProductFile($request->user(), $orderId, $productId);

        return Storage::disk('private')->download($fileDetails['path'], $fileDetails['name']);
    }
}
