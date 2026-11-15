<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class StockAdjustmentData extends Data
{
    public function __construct(
        #[Exists('product_variants', 'id')]
        public string $productVariantId,

        public int $quantityDelta,

        #[In(['adjustment', 'restock', 'damage', 'return'])]
        public string $type,

        #[Nullable]
        #[StringType]
        #[Max(255)]
        public ?string $reason = null,
    ) {}
}
