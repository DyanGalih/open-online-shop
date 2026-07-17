<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AuthShowRegisterController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('auth/register');
    }
}
