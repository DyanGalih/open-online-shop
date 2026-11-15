<?php

namespace App\Http\Controllers\Admin;

use App\Data\VariantStoreData;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;

class VariantStoreController extends Controller
{
    public function __invoke(VariantStoreData $data, ProductService $productService): RedirectResponse
    {
        /** @var Product $product */
        $product = Product::findOrFail($data->productId);
        $productService->addVariant($product, $data);

        return back()->with('success', 'Variant created.');
    }
}
