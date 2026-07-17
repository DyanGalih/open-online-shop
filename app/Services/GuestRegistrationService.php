<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use App\Mail\GuestAccountCreated;

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
