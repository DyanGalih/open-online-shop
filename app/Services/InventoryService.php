<?php

namespace App\Services;

use App\Data\StockAdjustmentData;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class InventoryService
{
    /**
     * Atomically reserve stock for a variant using row-level locking.
     */
    public function reserveStock(string $variantId, int $quantity, ?string $orderId = null): bool
    {
        return DB::transaction(function () use ($variantId, $quantity, $orderId) {
            /** @var ProductVariant|null $variant */
            $variant = ProductVariant::where('id', $variantId)->lockForUpdate()->first();

            if (! $variant || $variant->stock < $quantity) {
                return false;
            }

            $variant->decrement('stock', $quantity);

            StockMovement::create([
                'product_variant_id' => $variant->id,
                'order_id' => $orderId,
                'type' => 'reservation',
                'quantity_delta' => -$quantity,
                'balance_after' => (int) $variant->fresh()->stock,
                'reason' => 'Checkout reservation',
            ]);

            return true;
        });
    }

    /**
     * Atomically release reserved stock.
     */
    public function releaseReservation(string $variantId, int $quantity, ?string $orderId = null, string $reason = 'Reservation expired'): void
    {
        DB::transaction(function () use ($variantId, $quantity, $orderId, $reason) {
            /** @var ProductVariant|null $variant */
            $variant = ProductVariant::where('id', $variantId)->lockForUpdate()->first();

            if (! $variant) {
                return;
            }

            $variant->increment('stock', $quantity);

            StockMovement::create([
                'product_variant_id' => $variant->id,
                'order_id' => $orderId,
                'type' => 'reservation_release',
                'quantity_delta' => $quantity,
                'balance_after' => (int) $variant->fresh()->stock,
                'reason' => $reason,
            ]);
        });
    }

    /**
     * Adjust stock with audit tracking.
     */
    public function adjustStock(StockAdjustmentData $data, ?int $userId = null): StockMovement
    {
        return DB::transaction(function () use ($data, $userId) {
            /** @var ProductVariant $variant */
            $variant = ProductVariant::where('id', $data->productVariantId)->lockForUpdate()->firstOrFail();

            $newBalance = $variant->stock + $data->quantityDelta;
            if ($newBalance < 0) {
                throw new InvalidArgumentException('Stock balance cannot be negative.');
            }

            $variant->update(['stock' => $newBalance]);

            return StockMovement::create([
                'product_variant_id' => $variant->id,
                'user_id' => $userId,
                'type' => $data->type,
                'quantity_delta' => $data->quantityDelta,
                'balance_after' => $newBalance,
                'reason' => $data->reason,
            ]);
        });
    }
}
