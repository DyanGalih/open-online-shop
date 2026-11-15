<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class CatalogFilterData extends Data
{
    public function __construct(
        #[Max(100)]
        public ?string $search = null,

        #[Max(100)]
        public ?string $category = null,

        #[Min(0)]
        public ?int $minPrice = null,

        #[Min(0)]
        public ?int $maxPrice = null,

        #[Min(1)]
        #[Max(100)]
        public int $perPage = 15,
    ) {}
}
