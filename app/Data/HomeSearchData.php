<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class HomeSearchData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?string $categoryId = null,
        public ?string $sort = 'latest',
        public ?string $filter = null,
    ) {}
}
