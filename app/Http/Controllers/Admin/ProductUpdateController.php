<?php

namespace App\Http\Controllers\Admin;

use App\Data\ProductUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;

class ProductUpdateController extends Controller
{
    public function __invoke(Product $product, ProductUpdateData $data, ProductService $productService): RedirectResponse
    {
        $productService->updateProduct($product, $data, $data->digitalFile);

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }
}
