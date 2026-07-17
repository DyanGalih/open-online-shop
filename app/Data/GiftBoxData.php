<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class GiftBoxData extends Data
{
    public function __construct(
        public string $box_style,
        /** @var int[] */
        #[Min(3), Max(5)]
        public array $selected_items,
        public ?string $card_message = null,
    ) {}
}
