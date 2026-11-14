<?php

namespace App\Http\Controllers\Admin;

use App\Data\ProductStoreData;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;

class ProductStoreController extends Controller
{
    public function __invoke(ProductStoreData $data, ProductService $productService): RedirectResponse
    {
        $productService->createProduct($data, $data->digitalFile);

        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }
}
