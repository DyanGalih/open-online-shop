<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class RegisterData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,

        #[Email]
        #[Max(255)]
        #[Unique('users', 'email')]
        public string $email,

        #[Min(8)]
        #[Confirmed]
        public string $password,
    ) {}
}
