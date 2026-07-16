<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class HomeSearchData extends Data
{
    public function __construct(
        public ?string $search = null,
        public ?int $categoryId = null,
        public ?string $sort = 'latest',
    ) {}
}
