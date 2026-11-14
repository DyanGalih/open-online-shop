<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SignedUrlService;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class VerifyMagicLinkController extends Controller
{
    public function __invoke(Request $request, string $signer, SignedUrlService $signedUrlService): RedirectResponse
    {
        if (! $signedUrlService->verifySignature($request)) {
            return redirect()->route('login')->with('error', 'This sign-in link is invalid or has expired. Please request a new one.');
        }

        $token = $request->query('token');
        if (! $token) {
            return redirect()->route('login')->with('error', 'This sign-in link is invalid or has expired. Please request a new one.');
        }

        $tokenHash = hash('sha256', $token);
        try {
            $cachedUserId = Cache::lock("magic-link:consume:{$tokenHash}", 10)->block(5, function () use ($tokenHash) {
                return Cache::pull("magic-link:token:{$tokenHash}");
            });
        } catch (LockTimeoutException) {
            return redirect()->route('login')->with('error', 'This sign-in link has already been used or has expired. Please request a new one.');
        }

        if (! $cachedUserId || (string) $cachedUserId !== (string) $signer) {
            return redirect()->route('login')->with('error', 'This sign-in link has already been used or has expired. Please request a new one.');
        }

        $user = User::findOrFail($signer);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('orders.index')->with('success', 'Successfully signed in.');
    }
}
