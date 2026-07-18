<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class ProductData extends Data
{
    public function __construct(
        public ?string $id,
        public string $categoryId,
        public string $name,
        public string $slug,
        public ?string $description = null,
        public float $price = 0,
        public bool $isDigital = false,
        public ?string $filePath = null,
        public int $stock = 0,
        public string $status = 'draft',
        public float $rating = 0.0,
        public int $reviewsCount = 0,
        public ?CategoryData $category = null,
    ) {}
}
