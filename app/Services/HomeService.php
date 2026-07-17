<?php

namespace App\Services;

use App\Data\CategoryData;
use App\Data\HomeSearchData;
use App\Data\ProductData;
use Illuminate\Support\Collection;

class HomeService
{
    /**
     * @var array<int, array{id: int, title: string, slug: string, price: float, image_url: null, category: array{id: int, name: string, slug: string}}>
     */
    private array $productsList = [];

    /**
     * Get mock categories dataset.
     *
     * @return Collection<int, array{id: int, name: string, slug: string}>
     */
    private function getRawCategories(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Home & Living', 'slug' => 'home-living'],
            ['id' => 2, 'name' => 'Beauty & Skincare', 'slug' => 'beauty-skincare'],
            ['id' => 3, 'name' => 'Fashion', 'slug' => 'fashion'],
            ['id' => 4, 'name' => 'Accessories', 'slug' => 'accessories'],
            ['id' => 5, 'name' => 'Stationery', 'slug' => 'stationery'],
        ]);
    }

    /**
     * Ensure that the products list is initialized.
     */
    private function ensureProductsInitialized(): void
    {
        if (! empty($this->productsList)) {
            return;
        }

        $categories = $this->getRawCategories()->keyBy('id');

        $cat1 = $categories->get(1);
        $cat4 = $categories->get(4);

        if ($cat1 === null || $cat4 === null) {
            throw new \RuntimeException('Required mock categories not found');
        }

        $this->productsList = [
            [
                'id' => 1,
                'title' => 'Minimal Ceramic Mug',
                'slug' => 'minimal-ceramic-mug',
                'price' => 18.00,
                'image_url' => null,
                'category' => $cat1,
            ],
            [
                'id' => 2,
                'title' => 'Scented Soy Candle',
                'slug' => 'scented-soy-candle',
                'price' => 22.00,
                'image_url' => null,
                'category' => $cat1,
            ],
            [
                'id' => 3,
                'title' => 'Canvas Everyday Tote',
                'slug' => 'canvas-everyday-tote',
                'price' => 34.00,
                'image_url' => null,
                'category' => $cat4,
            ],
            [
                'id' => 4,
                'title' => 'Classic Minimal Watch',
                'slug' => 'classic-minimal-watch',
                'price' => 49.00,
                'image_url' => null,
                'category' => $cat4,
            ],
        ];
    }

    /**
     * @return Collection<int, array{id: int, title: string, slug: string, price: float, image_url: null, category: array{id: int, name: string, slug: string}}>
     */
    private function getRawProducts(): Collection
    {
        $this->ensureProductsInitialized();

        return new Collection(array_values($this->productsList));
    }

    /**
     * Get the general product catalog.
     *
     * @return Collection<int, ProductData>
     */
    public function getGeneralCatalog(): Collection
    {
        $products = $this->getRawProducts()->map(fn ($item) => (object) $item);

        return ProductData::collect($products);
    }

    /**
     * Get categories list.
     *
     * @return Collection<int, CategoryData>
     */
    public function getCategories(): Collection
    {
        $categories = $this->getRawCategories()->map(fn ($item) => (object) $item);

        return CategoryData::collect($categories);
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

        $allProducts = $this->getRawProducts();

        // Mocked personalized content using first two items
        $recentlyViewed = $allProducts->slice(0, 2)->map(fn ($item) => (object) $item);
        $recommended = $allProducts->slice(2, 2)->map(fn ($item) => (object) $item);

        return [
            'recently_viewed' => ProductData::collect($recentlyViewed),
            'recommended' => ProductData::collect($recommended),
            'has_recent_order' => true,
        ];
    }

    /**
     * Search products based on DTO.
     *
     * @return Collection<int, ProductData>
     */
    public function searchProducts(HomeSearchData $dto): Collection
    {
        $filtered = $this->getRawProducts();

        if ($dto->categoryId) {
            $filtered = $filtered->filter(fn ($p) => $p['category']['id'] === (int) $dto->categoryId);
        }

        if ($dto->search) {
            $searchLower = strtolower($dto->search);
            $filtered = $filtered->filter(fn ($p) => str_contains(strtolower($p['title']), $searchLower));
        }

        $mapped = $filtered->map(fn ($item) => (object) $item);

        return ProductData::collect($mapped);
    }
}
