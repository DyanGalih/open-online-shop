<?php

namespace App\Services;

use App\Mail\GuestAccountCreated;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class GuestRegistrationService
{
    public function registerGuest(string $email, string $name): User
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            return $user;
        }

        $password = Str::random(12);

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        event(new Registered($user));

        Mail::to($user->email)->send(new GuestAccountCreated($user, $password));

        return $user;
    }
}
