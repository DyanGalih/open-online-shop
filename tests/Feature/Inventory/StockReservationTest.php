<?php

use App\Data\StockAdjustmentData;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\User;
use App\Services\InventoryService;

beforeEach(function () {
    $this->category = Category::factory()->create();
    $this->product = Product::factory()->create(['category_id' => $this->category->id]);
    $this->variant = ProductVariant::create([
        'product_id' => $this->product->id,
        'sku' => 'STOCK-TEST-SKU',
        'name' => 'Test Variant',
        'price' => 10000,
        'stock' => 10,
        'is_default' => true,
    ]);
    $this->inventoryService = new InventoryService;
});

it('successfully reserves stock when available and logs a movement', function () {
    $reserved = $this->inventoryService->reserveStock($this->variant->id, 3);

    expect($reserved)->toBeTrue()
        ->and($this->variant->fresh()->stock)->toBe(7);

    $movement = StockMovement::where('product_variant_id', $this->variant->id)->latest()->first();
    expect($movement)->not->toBeNull()
        ->and($movement->quantity_delta)->toBe(-3)
        ->and($movement->balance_after)->toBe(7)
        ->and($movement->type)->toBe('reservation');
});

it('rejects reservation when stock is insufficient', function () {
    $reserved = $this->inventoryService->reserveStock($this->variant->id, 15);

    expect($reserved)->toBeFalse()
        ->and($this->variant->fresh()->stock)->toBe(10);
});

it('releases reserved stock idempotently and increments balance', function () {
    $this->inventoryService->reserveStock($this->variant->id, 4);
    expect($this->variant->fresh()->stock)->toBe(6);

    $this->inventoryService->releaseReservation($this->variant->id, 4, null, 'Order cancelled');
    expect($this->variant->fresh()->stock)->toBe(10);

    $releaseMovement = StockMovement::where('product_variant_id', $this->variant->id)->latest()->first();
    expect($releaseMovement->quantity_delta)->toBe(4)
        ->and($releaseMovement->type)->toBe('reservation_release')
        ->and($releaseMovement->reason)->toBe('Order cancelled');
});

it('allows authorized admin to manually adjust stock with an audit trail', function () {
    $admin = User::factory()->admin()->create();

    $adjustmentData = new StockAdjustmentData(
        productVariantId: $this->variant->id,
        quantityDelta: 5,
        type: 'restock',
        reason: 'Received supplier shipment'
    );

    $movement = $this->inventoryService->adjustStock($adjustmentData, $admin->id);

    expect($this->variant->fresh()->stock)->toBe(15)
        ->and($movement->quantity_delta)->toBe(5)
        ->and($movement->balance_after)->toBe(15)
        ->and($movement->user_id)->toBe($admin->id)
        ->and($movement->reason)->toBe('Received supplier shipment');
});
