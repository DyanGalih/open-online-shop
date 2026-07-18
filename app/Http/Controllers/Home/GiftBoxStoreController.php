<?php

namespace App\Http\Controllers\Home;

use App\Data\GiftBoxData;
use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GiftBoxStoreController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    /**
     * Store a validated gift box in the session/cart.
     */
    public function __invoke(Request $request): JsonResponse|RedirectResponse
    {
        $giftBoxData = GiftBoxData::validateAndCreate($request->all());

        $result = $this->homeService->calculateAndAddGiftBox($giftBoxData);

        if ($request->wantsJson()) {
            return response()->json($result);
        }

        return redirect()->back()->with('success', $result['message']);
    }
}
