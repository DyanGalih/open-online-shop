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
    /**
     * @return array{user: User, is_new: bool}
     */
    public function registerGuest(string $email, string $name): array
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            return [
                'user' => $user,
                'is_new' => false,
            ];
        }

        $password = Str::random(12);

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        event(new Registered($user));

        Mail::to($user->email)->queue(new GuestAccountCreated($user, $password));

        return [
            'user' => $user,
            'is_new' => true,
        ];
    }
}
