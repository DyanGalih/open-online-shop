<?php

namespace App\Services;

use App\Data\CategoryData;
use App\Data\GiftBoxData;
use App\Data\HomeSearchData;
use App\Data\ProductData;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class HomeService
{
    /**
     * Get the general product catalog from the database.
     *
     * @return Collection<int, ProductData>
     */
    public function getGeneralCatalog(): Collection
    {
        $products = Product::where('status', 'active')
            ->with('category')
            ->latest()
            ->get();

        return ProductData::collect($products);
    }

    /**
     * Get categories list from the database.
     *
     * @return Collection<int, CategoryData>
     */
    public function getCategories(): Collection
    {
        return CategoryData::collect(Category::orderBy('name')->get());
    }

    /**
     * Get personalized content for the user.
     *
     * @return array<string, mixed>
     */
    public function getPersonalizedContent(mixed $user): array
    {
        if (! $user) {
            return [];
        }

        $allProducts = Product::where('status', 'active')->limit(4)->get();

        if ($allProducts->isEmpty()) {
            return [];
        }

        $recentlyViewed = $allProducts->slice(0, 2);
        $recommended = $allProducts->slice(2, 2);

        return [
            'recently_viewed' => ProductData::collect($recentlyViewed),
            'recommended' => ProductData::collect($recommended),
            'has_recent_order' => true,
        ];
    }

    public function searchProducts(HomeSearchData $dto): Collection
    {
        $query = Product::where('status', 'active')->with('category');

        if ($dto->categoryId) {
            $query->where('category_id', $dto->categoryId);
        }

        if ($dto->search) {
            $query->where('name', 'like', "%{$dto->search}%");
        }

        if ($dto->filter) {
            if ($dto->filter === 'new-arrivals') {
                $query->orderBy('created_at', 'desc');
            } elseif ($dto->filter === 'best-sellers') {
                $query->orderBy('rating', 'desc')->orderBy('reviews_count', 'desc');
            } elseif ($dto->filter === 'sale') {
                $query->orderBy('price', 'asc');
            }
        } else {
            $query->latest();
        }

        return ProductData::collect($query->get());
    }

    /**
     * Calculate authoritative price for a gift box and simulate adding to cart.
     *
     * @return array<string, mixed>
     */
    public function calculateAndAddGiftBox(GiftBoxData $data): array
    {
        // 1. Authoritative Box Pricing
        $boxPrices = [
            'kraft-box' => 10.0,
            'sage-ribbon-box' => 12.0,
        ];

        $boxPrice = $boxPrices[$data->boxStyle] ?? 10.0;

        // 2. Authoritative Item Pricing - ensure uniqueness and existence
        if (count(array_unique($data->selectedItems)) !== count($data->selectedItems)) {
            throw ValidationException::withMessages([
                'selected_items' => ['The selected items must be unique.'],
            ]);
        }

        $selectedItems = Product::whereIn('id', $data->selectedItems)->get();

        if ($selectedItems->count() !== count($data->selectedItems)) {
            throw ValidationException::withMessages([
                'selected_items' => ['One or more selected products are invalid or unavailable.'],
            ]);
        }

        $itemsTotal = $selectedItems->sum('price');
        $finalTotal = $boxPrice + $itemsTotal;

        return [
            'success' => true,
            'gift_box' => [
                'boxStyle' => $data->boxStyle,
                'items' => ProductData::collect($selectedItems),
                'cardMessage' => $data->cardMessage,
                'price' => $finalTotal,
            ],
            'message' => 'Custom gift box added to cart successfully.',
        ];
    }
}
