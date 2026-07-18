<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CartSyncItemData extends Data
{
    public function __construct(
        #[Exists('products', 'id')]
        public string $productId,

        #[Min(1)]
        public int $quantity,
    ) {}
}

class CartSyncData extends Data
{
    public function __construct(
        /** @var DataCollection<int, CartSyncItemData> */
        #[DataCollectionOf(CartSyncItemData::class)]
        public DataCollection $items,
    ) {}
}
