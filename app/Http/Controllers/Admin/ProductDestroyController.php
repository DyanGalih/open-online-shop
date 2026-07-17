<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;

class ProductDestroyController extends Controller
{
    public function __invoke(Product $product, ProductService $productService)
    {
        $productService->deleteProduct($product);
        return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
    }
}
