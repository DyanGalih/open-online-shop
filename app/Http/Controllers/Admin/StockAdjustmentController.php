<?php

namespace App\Http\Controllers\Admin;

use App\Data\StockAdjustmentData;
use App\Http\Controllers\Controller;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    public function __invoke(StockAdjustmentData $data, Request $request, InventoryService $inventoryService): RedirectResponse
    {
        $inventoryService->adjustStock($data, $request->user()?->id);

        return back()->with('success', 'Stock adjusted.');
    }
}
