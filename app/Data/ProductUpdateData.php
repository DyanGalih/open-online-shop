<?php

namespace App\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(CamelCaseMapper::class)]
#[MapOutputName(SnakeCaseMapper::class)]
class ProductUpdateData extends Data
{
    public function __construct(
        #[Exists('categories', 'id')]
        public string $categoryId,

        #[Max(255)]
        public string $name,

        public ?string $description,

        #[Min(0)]
        public int $price,

        public bool $isDigital,

        #[Min(0)]
        public int $stock,

        #[In(['active', 'draft'])]
        public string $status,

        #[MapInputName('digital_file')]
        #[Nullable]
        #[File]
        #[Mimes('pdf', 'zip', 'epub')]
        #[Max(51200)]
        public ?UploadedFile $digitalFile = null,
    ) {}
}
