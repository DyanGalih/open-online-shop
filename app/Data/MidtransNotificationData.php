<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
class MidtransNotificationData extends Data
{
    public function __construct(
        #[Required]
        public string $orderId,

        #[Required]
        public string $transactionStatus,

        #[Required]
        public string $statusCode,

        #[Required]
        public string $grossAmount,

        #[Required]
        public string $signatureKey,
    ) {}
}
