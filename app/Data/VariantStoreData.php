<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class VariantStoreData extends Data
{
    public function __construct(
        #[Exists('products', 'id')]
        public string $productId,

        #[StringType]
        #[Max(100)]
        #[Unique('product_variants', 'sku')]
        public string $sku,

        #[StringType]
        #[Max(255)]
        public string $name,

        #[Min(0)]
        public int $price,

        #[Min(0)]
        public int $stock = 0,

        public bool $isDefault = false,
    ) {}
}
