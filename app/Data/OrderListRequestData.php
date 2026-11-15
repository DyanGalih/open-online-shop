<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Data;

class OrderListRequestData extends Data
{
    public function __construct(
        #[Email]
        public ?string $email = null,
        public ?string $session_key = null
    ) {}
}
