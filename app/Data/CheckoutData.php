<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class CheckoutData extends Data
{
    public function __construct(
        #[RequiredWithout('userId')]
        #[Email]
        public ?string $email,

        #[RequiredWithout('userId')]
        public ?string $name,

        public ?string $shippingAddress,

        #[In('midtrans', 'manual')]
        public string $paymentMethod,
    ) {}
}
