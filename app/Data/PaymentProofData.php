<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Image;
use Spatie\LaravelData\Attributes\Validation\Max;

class PaymentProofData extends Data
{
    public function __construct(
        #[Image]
        #[Max(5120)]
        public UploadedFile $payment_proof,
    ) {}
}
