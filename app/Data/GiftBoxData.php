<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Distinct;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class GiftBoxData extends Data
{
    public function __construct(
        #[MapInputName('box_style')]
        #[In(['kraft-box', 'sage-ribbon-box'])]
        public string $boxStyle,

        /** @var string[] */
        #[MapInputName('selected_items')]
        #[Min(3), Max(5), Distinct, ArrayType, Exists('products', 'id')]
        public array $selectedItems,

        #[MapInputName('card_message')]
        #[Max(250)]
        public ?string $cardMessage = null,
    ) {}

    /** @return array<string, array<int, string>> */
    public static function rules(): array
    {
        return [
            'selected_items' => ['array', 'distinct', 'min:3', 'max:5'],
        ];
    }
}
