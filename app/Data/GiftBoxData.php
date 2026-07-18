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
use Spatie\LaravelData\Mappers\CamelCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
class GiftBoxData extends Data
{
    public function __construct(
        #[In(['kraft-box', 'sage-ribbon-box'])]
        public string $boxStyle,

        /** @var string[] */
        #[Min(3), Max(5), Distinct, ArrayType, Exists('products', 'id')]
        public array $selectedItems,

        #[Max(250)]
        public ?string $cardMessage = null,
    ) {}

    public static function rules(): array
    {
        return [
            'selectedItems' => ['array', 'distinct', 'min:3', 'max:5'],
        ];
    }
}
