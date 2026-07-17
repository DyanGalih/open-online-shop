<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class CheckoutDetailsData extends Data
{
    public function __construct(
        /** @var \App\Data\CartItemDetailsData[] */
        public DataCollection $cartItems,
        public int $total,
        public bool $requiresShipping,
    ) {}
}
