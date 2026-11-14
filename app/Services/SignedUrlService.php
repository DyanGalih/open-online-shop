<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

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
     * Generate 5-minute single-use signed URL for magic-link login.
     */
    public function generateMagicLoginLink(User $user): string
    {
        $token = Str::random(40);
        $tokenHash = hash('sha256', $token);
        Cache::put("magic-link:token:{$tokenHash}", $user->id, now()->addMinutes(5));

        return URL::temporarySignedRoute(
            'login.link.verify',
            now()->addMinutes(5),
            [
                'signer' => $user->id,
                'token' => $token,
            ]
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
