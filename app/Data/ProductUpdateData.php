<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\In;

class ProductUpdateData extends Data
{
    public function __construct(
        #[Exists('categories', 'id')]
        public int $category_id,
        
        #[Max(255)]
        public string $name,
        
        public ?string $description,
        
        #[Min(0)]
        public int $price,
        
        public bool $is_digital,
        
        #[Min(0)]
        public int $stock,
        
        #[In(['active', 'draft'])]
        public string $status,
    ) {}
}
