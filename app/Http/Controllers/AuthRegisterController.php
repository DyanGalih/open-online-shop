<?php

namespace App\Http\Controllers;

use App\Data\RegisterData;
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
