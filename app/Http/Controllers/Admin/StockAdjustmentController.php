<?php

namespace App\Http\Controllers\Admin;

use App\Data\StockAdjustmentData;
use App\Http\Controllers\Controller;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class StockAdjustmentController extends Controller
{
    public function __invoke(StockAdjustmentData $data, Request $request, InventoryService $inventoryService): RedirectResponse
    {
        try {
            $inventoryService->adjustStock($data, $request->user()?->id);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'quantityDelta' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Stock adjusted.');
    }
}
