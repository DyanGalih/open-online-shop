<?php

use App\Models\User;

it('grants admin privileges to an existing user via artisan command', function () {
    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $this->artisan('admin:grant', ['email' => $user->email])
        ->expectsOutput("Successfully granted admin privileges to {$user->email}.")
        ->assertSuccessful();

    expect($user->fresh()->is_admin)->toBeTrue();
});

it('fails to grant admin privileges if user email does not exist', function () {
    $this->artisan('admin:grant', ['email' => 'nonexistent@example.com'])
        ->expectsOutput("User with email 'nonexistent@example.com' not found.")
        ->assertFailed();
});
