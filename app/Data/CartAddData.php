<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Min;

class CartAddData extends Data
{
    public function __construct(
        #[Exists('products', 'id')]
        public int $product_id,
        
        #[Min(1)]
        public int $quantity,
    ) {}
}
