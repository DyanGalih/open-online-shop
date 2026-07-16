<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ProductData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $slug,
        public float $price,
        public ?string $image_url,
        public ?CategoryData $category = null,
    ) {}
}
