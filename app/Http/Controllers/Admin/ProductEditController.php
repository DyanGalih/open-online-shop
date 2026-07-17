<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use App\Data\ProductData;
use App\Data\CategoryData;

class ProductEditController extends Controller
{
    public function __invoke(Product $product)
    {
        $categories = Category::latest()->get();
        return Inertia::render('admin/products/edit', [
            'product' => ProductData::from($product),
            'categories' => CategoryData::collect($categories),
        ]);
    }
}
