<?php

namespace App\Services;

use App\Data\ReviewStoreData;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    /**
     * Store a product review and update the product cache.
     */
    public function storeReview(User $user, string $productId, ReviewStoreData $data): Review
    {
        // 1. Check if the user has already reviewed this product
        $existing = Review::where('product_id', $productId)
            ->where('user_id', $user->id)
            ->exists();

        if ($existing) {
            throw ValidationException::withMessages([
                'product_id' => ['You have already submitted a review for this product.'],
            ]);
        }

        return DB::transaction(function () use ($user, $productId, $data) {
            // 2. Create the review
            $review = Review::create([
                'product_id' => $productId,
                'user_id' => $user->id,
                'rating' => $data->rating,
                'comment' => $data->comment,
            ]);

            // 3. Recalculate and cache average rating & count on the Product
            $avg = (float) (Review::where('product_id', $productId)->avg('rating') ?: 0.0);
            $count = Review::where('product_id', $productId)->count();

            Product::where('id', $productId)->update([
                'rating' => round($avg, 2),
                'reviews_count' => $count,
            ]);

            return $review;
        });
    }
}
