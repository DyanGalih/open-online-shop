<?php

namespace App\Http\Controllers;

use App\Data\LoginData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
