<?php

namespace App\Data;

use App\Models\Order;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CheckoutOrderViewData extends Data
{
    /**
     * @param DataCollection<int, CartItemDetailsData> $items
     */
    public function __construct(
        public string $id,
        public string $status,
        public int $totalAmount,
        public ?string $paymentMethod,
        public ?string $shippingAddress,
        public ?string $paymentDueAt,
        public DataCollection $items,
    ) {}

    public static function fromModel(Order $order): self
    {
        $items = $order->items->map(fn ($item) => new CartItemDetailsData(
            id: (string) $item->product_id,
            name: $item->product_name,
            price: (int) $item->price,
            quantity: (int) $item->quantity
        ))->all();

        return new self(
            id: $order->id,
            status: $order->status,
            totalAmount: (int) $order->total_amount,
            paymentMethod: $order->payment_method,
            shippingAddress: $order->shipping_address,
            paymentDueAt: $order->payment_due_at?->toISOString(),
            items: new DataCollection(CartItemDetailsData::class, $items)
        );
    }
}
