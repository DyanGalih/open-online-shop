<?php

namespace App\Services;

use App\Data\CatalogFilterData;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class CatalogService
{
    /** @return Collection<int, Product> */
    public function getActiveProducts(Request $request): Collection
    {
        $query = Product::where('status', 'active')->with('category');

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return $query->latest()->get();
    }

    /**
     * Search and filter published catalog products.
     *
     * @return LengthAwarePaginator<int, Product>
     */
    public function searchCatalog(CatalogFilterData $filters): LengthAwarePaginator
    {
        $query = Product::query()
            ->where('status', 'active')
            ->with('category');

        if ($filters->search !== null && $filters->search !== '') {
            $searchTerm = '%'.$filters->search.'%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            });
        }

        if ($filters->category !== null && $filters->category !== '') {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters->category);
            });
        }

        if ($filters->minPrice !== null) {
            $query->where('price', '>=', $filters->minPrice);
        }

        if ($filters->maxPrice !== null) {
            $query->where('price', '<=', $filters->maxPrice);
        }

        return $query->latest()->paginate($filters->perPage);
    }

    /** @return Collection<int, Category> */
    public function getAllCategories(): Collection
    {
        return Category::all();
    }
}
