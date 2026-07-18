<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class MidtransNotificationData extends Data
{
    public function __construct(
        #[Required]
        public string $orderId,

        #[Required]
        public string $transactionStatus,
    ) {}
}
