<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CategoryData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public string $slug,
        public ?string $description = null,
    ) {}
}
