<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasUlids;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'is_digital',
        'file_path',
        'stock',
        'status',
    ];

    protected $casts = [
        'is_digital' => 'boolean',
        'price' => 'integer',
        'stock' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
