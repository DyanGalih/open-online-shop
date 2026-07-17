<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Email;

class LoginData extends Data
{
    public function __construct(
        #[Email]
        public string $email,
        
        public string $password,
    ) {}
}
