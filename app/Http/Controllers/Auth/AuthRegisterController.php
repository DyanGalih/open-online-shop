<?php

namespace App\Http\Controllers\Auth;

use App\Data\RegisterData;
use App\Http\Controllers\Controller;
use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthRegisterController extends Controller
{
    use RedirectsToCurrentTeam;

    public function __invoke(RegisterData $data, AuthService $authService, Request $request): RedirectResponse
    {
        $user = $authService->registerUser($data);

        Auth::login($user);

        return redirect($this->redirectPathForCurrentTeam($request, '/dashboard'));
    }
}
