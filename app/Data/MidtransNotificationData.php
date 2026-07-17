<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;

class MidtransNotificationData extends Data
{
    public function __construct(
        #[Required]
        public string $order_id,
        
        #[Required]
        public string $transaction_status,
    ) {}
}
