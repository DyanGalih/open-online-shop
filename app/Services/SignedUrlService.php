<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SignedUrlService
{
    /**
     * Generate 1-hour signed URL for read-only order view.
     */
    public function generateCheckoutLink(Order $order): string
    {
        return URL::temporarySignedRoute(
            'orders.checkout.view',
            now()->addHour(),
            ['order' => $order->id]
        );
    }

    /**
     * Generate 5-minute signed URL for magic-link login.
     */
    public function generateMagicLoginLink(User $user): string
    {
        return URL::temporarySignedRoute(
            'login.link.verify',
            now()->addMinutes(5),
            ['signer' => $user->id]
        );
    }

    /**
     * Verify if request has a valid signature within TTL.
     */
    public function verifySignature(Request $request): bool
    {
        return $request->hasValidSignature();
    }
}
