<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

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
