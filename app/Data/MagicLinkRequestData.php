<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class MagicLinkRequestData extends Data
{
    public function __construct(
        #[Required]
        #[Email]
        #[Max(255)]
        public string $email,
    ) {}
}
