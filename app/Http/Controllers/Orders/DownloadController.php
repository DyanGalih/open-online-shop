<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DownloadController extends Controller
{
    public function __invoke(Order $order, Product $product, Request $request, OrderService $orderService): Response
    {
        Gate::authorize('view', $order);

        $fileDetails = $orderService->getDigitalProductFile($request->user(), $order, $product);

        return Storage::disk('private')->download($fileDetails['path'], $fileDetails['name']);
    }
}
