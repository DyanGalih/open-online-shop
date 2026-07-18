<?php

namespace App\Http\Controllers\Auth;

use App\Data\RegisterData;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;

class AuthRegisterController extends Controller
{
    public function __invoke(RegisterData $data, AuthService $authService)
    {
        $user = $authService->registerUser($data);

        Auth::login($user);

        return redirect('/dashboard');
    }
}
