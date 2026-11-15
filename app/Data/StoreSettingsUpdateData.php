<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class StoreSettingsUpdateData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $key,

        public ?string $value = null,

        #[Max(50)]
        public string $group = 'general',

        public bool $isSecret = false,
    ) {}
}
