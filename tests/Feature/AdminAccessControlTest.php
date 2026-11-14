<?php

use App\Models\User;

it('denies regular users access to admin routes even if they own personal teams', function () {
    $user = User::factory()->create();

    // Verify user owns their personal team
    expect($user->currentTeam)->not->toBeNull()
        ->and($user->ownsTeam($user->currentTeam))->toBeTrue()
        ->and($user->isAdmin())->toBeFalse();

    $response = $this->actingAs($user)->get('/admin');

    $response->assertForbidden();
});

it('allows designated platform admins access to admin routes', function () {
    $admin = User::factory()->admin()->create();

    expect($admin->isAdmin())->toBeTrue();

    $response = $this->actingAs($admin)->get('/admin');

    $response->assertOk();
});

it('redirects unauthenticated guests trying to access admin routes to login', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});
