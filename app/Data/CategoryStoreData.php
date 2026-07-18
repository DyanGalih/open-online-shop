<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CategoryStoreData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,

        public ?string $description,
    ) {}
}
