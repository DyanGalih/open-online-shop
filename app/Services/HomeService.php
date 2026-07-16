<?php

namespace App\Services;

use App\Data\HomeSearchData;
use App\Data\ProductData;
use App\Data\CategoryData;
use Illuminate\Support\Collection;

class HomeService
{
    /**
     * Get the general product catalog.
     * 
     * @return \Spatie\LaravelData\DataCollection
     */
    public function getGeneralCatalog()
    {
        // Mocked implementation for now, should query Eloquent
        $products = collect([
            (object)['id' => 1, 'title' => 'Sample Product 1', 'slug' => 'sample-1', 'price' => 10.99, 'image_url' => null],
            (object)['id' => 2, 'title' => 'Sample Product 2', 'slug' => 'sample-2', 'price' => 25.50, 'image_url' => null],
        ]);

        return ProductData::collect($products);
    }

    /**
     * Get categories list.
     * 
     * @return \Spatie\LaravelData\DataCollection
     */
    public function getCategories()
    {
        $categories = collect([
            (object)['id' => 1, 'name' => 'Electronics', 'slug' => 'electronics'],
            (object)['id' => 2, 'name' => 'Clothing', 'slug' => 'clothing'],
        ]);

        return CategoryData::collect($categories);
    }

    /**
     * Get personalized content for the user.
     */
    public function getPersonalizedContent($user): array
    {
        if (!$user) {
            return [];
        }

        // Mocked personalized content
        $recentlyViewed = collect([
            (object)['id' => 3, 'title' => 'Previously Viewed', 'slug' => 'prev', 'price' => 9.99, 'image_url' => null]
        ]);

        return [
            'recently_viewed' => ProductData::collect($recentlyViewed),
            'recommended' => ProductData::collect(collect([])),
            'has_recent_order' => true,
        ];
    }

    /**
     * Search products based on DTO.
     */
    public function searchProducts(HomeSearchData $dto)
    {
        // For now, return empty collection to satisfy the signature
        return ProductData::collect(collect([]));
    }
}
