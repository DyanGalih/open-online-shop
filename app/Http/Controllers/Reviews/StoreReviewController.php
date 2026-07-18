<?php

namespace App\Http\Controllers\Reviews;

use App\Data\ReviewStoreData;
use App\Http\Controllers\Controller;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreReviewController extends Controller
{
    public function __invoke(string $productId, ReviewStoreData $data, Request $request, ReviewService $reviewService): RedirectResponse
    {
        $reviewService->storeReview($request->user(), $productId, $data);

        return back()->with('success', 'Review submitted successfully.');
    }
}
