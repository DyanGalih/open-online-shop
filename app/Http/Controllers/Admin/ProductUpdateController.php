<?php

namespace App\Http\Controllers\Admin;

use App\Data\ProductUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductUpdateController extends Controller
{
    public function __invoke(Product $product, ProductUpdateData $data, Request $request, ProductService $productService)
    {
        $productService->updateProduct($product, $data, $request->file('digital_file'));

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }
}
