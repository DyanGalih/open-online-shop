<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AuthShowLoginController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('auth/login');
    }
}
