<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SignedUrlService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyMagicLinkController extends Controller
{
    public function __invoke(Request $request, string $signer, SignedUrlService $signedUrlService): RedirectResponse
    {
        if (! $signedUrlService->verifySignature($request)) {
            return redirect()->route('login')->with('error', 'This sign-in link is invalid or has expired. Please request a new one.');
        }

        $user = User::findOrFail($signer);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('orders.index')->with('success', 'Successfully signed in.');
    }
}
