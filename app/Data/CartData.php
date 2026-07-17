<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CartData extends Data
{
    public function __construct(
        public array $items = [],
        public int $total = 0,
    ) {}
}
