<?php

namespace App\Http\Controllers\Admin;

use App\Data\ProductStoreData;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductStoreController extends Controller
{
    public function __invoke(ProductStoreData $data, Request $request, ProductService $productService): RedirectResponse
    {
        $productService->createProduct($data, $request->file('digital_file'));

        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }
}
