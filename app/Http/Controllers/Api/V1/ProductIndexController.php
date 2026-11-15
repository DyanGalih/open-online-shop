<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductIndexController extends Controller
{
    /**
     * Display a listing of active catalog products for API consumers.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $products = Product::where('status', 'active')
            ->with('category')
            ->latest('id')
            ->paginate((int) $request->input('per_page', 15));

        return response()->json($products);
    }
}
