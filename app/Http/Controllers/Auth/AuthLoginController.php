<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class AuthLoginController extends Controller
{
    use RedirectsToCurrentTeam;

    public function __invoke(Request $request): RedirectResponse
    {
        $throttleKey = md5('login'.implode('|', [$request->input('email', ''), $request->ip()]));

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            abort(429, trans('auth.throttle', ['seconds' => $seconds]));
        }

        $credentials = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ])->validate();

        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            RateLimiter::clear($throttleKey);

            $user = Auth::user();

            if ($user && $user->hasEnabledTwoFactorAuthentication()) {
                // Logout the user temporarily just like Fortify does until confirmed
                Auth::logout();
                $request->session()->put('login.id', $user->id);

                return redirect()->route('two-factor.login');
            }

            $request->session()->regenerate();

            return redirect()->intended($this->redirectPathForCurrentTeam($request, '/dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
