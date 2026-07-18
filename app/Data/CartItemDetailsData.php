<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CartItemDetailsData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public int $price,
        public int $quantity,
    ) {}
}
