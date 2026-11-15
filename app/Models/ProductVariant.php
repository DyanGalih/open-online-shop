<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasUlids;

    protected $fillable = [
        'product_id',
        'sku',
        'name',
        'price',
        'stock',
        'is_default',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'is_default' => 'boolean',
    ];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasMany<StockMovement, $this> */
    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'product_variant_id');
    }
}
