<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Data\ProductData;
use App\Data\CategoryData;
use App\Services\CatalogService;

class StorefrontIndexController extends Controller
{
    public function __invoke(Request $request, CatalogService $catalogService)
    {
        $products = $catalogService->getActiveProducts($request);
        $categories = $catalogService->getAllCategories();

        return Inertia::render('storefront/index', [
            'products' => ProductData::collect($products),
            'categories' => CategoryData::collect($categories),
            'currentCategory' => $request->category,
        ]);
    }
}
