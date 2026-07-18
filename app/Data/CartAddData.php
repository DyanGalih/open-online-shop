<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CartAddData extends Data
{
    public function __construct(
        #[Exists('products', 'id')]
        public int $productId,

        #[Min(1)]
        public int $quantity,
    ) {}
}
