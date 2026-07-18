<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryData;
use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductIndexController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::with('category')->latest()->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/products/index', [
            'products' => ProductData::collect($products),
            'categories' => CategoryData::collect($categories),
        ]);
    }
}
