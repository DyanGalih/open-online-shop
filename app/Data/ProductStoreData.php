<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class ProductStoreData extends Data
{
    public function __construct(
        #[Exists('categories', 'id')]
        public string $categoryId,

        #[Max(255)]
        public string $name,

        public ?string $description,

        #[Min(0)]
        public int $price,

        public bool $isDigital,

        #[Min(0)]
        public int $stock,

        #[In(['active', 'draft'])]
        public string $status,
    ) {}
}
