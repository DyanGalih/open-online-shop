<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Max;

class CategoryStoreData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        
        public ?string $description,
    ) {}
}
