<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CheckoutDetailsData extends Data
{
    public function __construct(
        /** @var CartItemDetailsData[] */
        public DataCollection $cartItems,
        public int $total,
        public bool $requiresShipping,
    ) {}
}
