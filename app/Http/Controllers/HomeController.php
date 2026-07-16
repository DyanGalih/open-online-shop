<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\HomeService;
use App\Data\HomeSearchData;

class HomeController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): \Inertia\Response
    {
        // 1. Validate incoming request into a strict DTO using Spatie Laravel Data
        $searchData = HomeSearchData::from($request->all());

        // 2. Delegate to business logic service
        $categories = $this->homeService->getCategories();
        
        $products = $searchData->search || $searchData->categoryId 
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
