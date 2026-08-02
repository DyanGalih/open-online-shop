<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Email;

class OrderListRequestData extends Data
{
    public function __construct(
        #[Email]
        public ?string $email = null,
        public ?string $session_key = null
    ) {}
}
