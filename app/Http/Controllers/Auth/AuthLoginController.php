<?php

namespace App\Http\Controllers\Auth;

use App\Data\LoginData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthLoginController extends Controller
{
    public function __invoke(LoginData $data, Request $request)
    {
        if (Auth::attempt(['email' => $data->email, 'password' => $data->password])) {
            $request->session()->regenerate();

            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
