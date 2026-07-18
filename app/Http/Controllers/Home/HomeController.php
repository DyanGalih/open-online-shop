<?php

namespace App\Http\Controllers\Home;

use App\Data\HomeSearchData;
use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        // 1. Validate incoming request into a strict DTO using Spatie Laravel Data
        $searchData = HomeSearchData::from($request->all());

        // 2. Delegate to business logic service
        $categories = $this->homeService->getCategories();

        $products = $searchData->search || $searchData->categoryId || $searchData->filter
            ? $this->homeService->searchProducts($searchData)
            : $this->homeService->getGeneralCatalog();

        $personalized = $this->homeService->getPersonalizedContent($request->user());

        // 3. Return Inertia response with safe Data objects
        return Inertia::render('home/index', [
            'products' => $products,
            'categories' => $categories,
            'personalized' => $personalized,
            'filters' => $searchData,
        ]);
    }
}
