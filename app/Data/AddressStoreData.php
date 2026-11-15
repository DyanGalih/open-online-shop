<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class AddressStoreData extends Data
{
    public function __construct(
        #[StringType]
        #[Max(255)]
        public string $recipientName,

        #[StringType]
        #[Max(30)]
        public string $phone,

        #[StringType]
        #[Max(255)]
        public string $street,

        #[StringType]
        #[Max(100)]
        public string $city,

        #[StringType]
        #[Max(20)]
        public string $postalCode,

        public bool $isDefault = false,
    ) {}
}
