<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class CatalogService
{
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

    public function getAllCategories(): Collection
    {
        return Category::all();
    }
}
