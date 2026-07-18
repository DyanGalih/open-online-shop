<?php

namespace App\Services;

use App\Data\RegisterData;
use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{
    public function registerUser(RegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => Hash::make($data->password),
            ]);

            // Create personal team for user
            $team = Team::create([
                'user_id' => $user->id,
                'name' => "{$user->name}'s Team",
                'is_personal' => true,
                'slug' => Str::slug("{$user->name}'s Team"),
            ]);

            $user->teams()->attach($team, ['role' => TeamRole::Owner->value]);
            $user->update(['current_team_id' => $team->id]);

            event(new Registered($user));

            return $user;
        });
    }
}
