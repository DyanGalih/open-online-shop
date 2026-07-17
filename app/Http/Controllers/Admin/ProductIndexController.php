<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use App\Data\ProductData;

class ProductIndexController extends Controller
{
    public function __invoke()
    {
        $products = Product::with('category')->latest()->get();
        return Inertia::render('admin/products/index', [
            'products' => ProductData::collect($products),
        ]);
    }
}
