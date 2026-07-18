<?php

namespace App\Http\Controllers\Storefront;

use App\Data\CategoryData;
use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Services\CatalogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
