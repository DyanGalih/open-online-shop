<?php

namespace App\Http\Controllers\Auth;

use App\Data\MagicLinkRequestData;
use App\Http\Controllers\Controller;
use App\Mail\MagicLinkLogin;
use App\Models\User;
use App\Services\SignedUrlService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class RequestMagicLinkController extends Controller
{
    public function __invoke(MagicLinkRequestData $data, Request $request, SignedUrlService $signedUrlService): JsonResponse|RedirectResponse
    {
        $emailKey = 'magic-link:email:'.sha1(strtolower(trim($data->email)));
        $ipKey = 'magic-link:ip:'.$request->ip();

        if (RateLimiter::tooManyAttempts($emailKey, 3) || RateLimiter::tooManyAttempts($ipKey, 3)) {
            Log::warning('Magic link request rate limit exceeded', [
                'ip' => $request->ip(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Too many requests. Please try again later.',
                ], 429);
            }

            return back()->with('error', 'Too many requests. Please try again later.');
        }

        RateLimiter::hit($emailKey, 3600);
        RateLimiter::hit($ipKey, 3600);

        $user = User::where('email', $data->email)->first();

        if ($user) {
            $loginUrl = $signedUrlService->generateMagicLoginLink($user);
            Mail::to($user->email)->queue(new MagicLinkLogin($user, $loginUrl));
        }

        $message = 'If your email address is registered, we have sent a secure sign-in link.';

        if ($request->wantsJson()) {
            return response()->json(['message' => $message]);
        }

        return back()->with('success', $message);
    }
}
