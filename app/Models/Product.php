<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasUlids;

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
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'is_digital' => 'boolean',
        'price' => 'integer',
        'stock' => 'integer',
        'rating' => 'float',
        'reviews_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
