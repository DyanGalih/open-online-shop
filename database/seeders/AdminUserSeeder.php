<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Str::random(12);
        $email = 'admin_'.Str::lower(Str::random(5)).'@example.com';

        $user = User::create([
            'name' => 'Admin User',
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $teamName = 'Admin Team '.Str::upper(Str::random(3));
        $teamSlug = Str::slug($teamName);

        // Create a personal team for the admin user
        $team = Team::create([
            'name' => $teamName,
            'slug' => $teamSlug,
            'is_personal' => true,
        ]);

        // Attach user to the team as owner
        $user->teams()->attach($team, ['role' => TeamRole::Owner->value]);

        // Set as current team
        $user->update(['current_team_id' => $team->id]);

        $this->command->info('-----------------------------------------');
        $this->command->info('Admin User & Team created successfully!');
        $this->command->info('Email: '.$email);
        $this->command->info('Password: '.$password);
        $this->command->info('Team Slug: '.$team->slug);
        $this->command->info('-----------------------------------------');
    }
}
