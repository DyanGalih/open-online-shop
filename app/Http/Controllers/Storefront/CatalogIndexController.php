<?php

namespace App\Http\Controllers\Storefront;

use App\Data\CatalogFilterData;
use App\Http\Controllers\Controller;
use App\Services\CatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogIndexController extends Controller
{
    public function __invoke(
        Request $request,
        CatalogFilterData $filters,
        CatalogService $catalogService
    ): Response|JsonResponse {
        $products = $catalogService->searchCatalog($filters);
        $categories = $catalogService->getAllCategories();

        if ($request->wantsJson()) {
            return response()->json([
                'products' => $products,
                'categories' => $categories,
            ]);
        }

        return Inertia::render('catalog/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters->toArray(),
        ]);
    }
}
