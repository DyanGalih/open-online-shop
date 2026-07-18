<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CartData extends Data
{
    public function __construct(
        /** @var array<int, mixed> */
        public array $items = [],
        public int $total = 0,
    ) {}
}
