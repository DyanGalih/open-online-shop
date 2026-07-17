<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ProductData extends Data
{
    public function __construct(
        public ?string $id,
        public string $category_id,
        public string $name,
        public string $slug,
        public ?string $description = null,
        public int $price = 0,
        public bool $is_digital = false,
        public ?string $file_path = null,
        public int $stock = 0,
        public string $status = 'draft',
        public ?CategoryData $category = null,
    ) {}
}
