<?php

namespace App\Http\Controllers\Home;

use App\Data\GiftBoxData;
use App\Http\Controllers\Controller;
use App\Services\HomeService;
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
    public function __invoke(Request $request): RedirectResponse
    {
        $giftBoxData = GiftBoxData::validateAndCreate($request->all());

        $result = $this->homeService->calculateAndAddGiftBox($giftBoxData);

        return redirect()->back()->with('success', 'Gift box added to cart!');
    }
}
