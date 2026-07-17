<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\Validation\Email;

class CheckoutData extends Data
{
    public function __construct(
        #[RequiredWithout('user_id')]
        #[Email]
        public ?string $email,

        #[RequiredWithout('user_id')]
        public ?string $name,

        public ?string $shipping_address,

        #[In('midtrans', 'manual')]
        public string $payment_method,
    ) {}
}
