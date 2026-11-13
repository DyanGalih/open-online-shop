<?php

use App\Http\Controllers\Settings\PasswordUpdateController;
use App\Http\Controllers\Settings\ProfileDestroyController;
use App\Http\Controllers\Settings\ProfileEditController;
use App\Http\Controllers\Settings\ProfileUpdateController;
use App\Http\Controllers\Settings\SecurityEditController;
use App\Http\Controllers\Teams\TeamDestroyController;
use App\Http\Controllers\Teams\TeamEditController;
use App\Http\Controllers\Teams\TeamIndexController;
use App\Http\Controllers\Teams\TeamInvitationDestroyController;
use App\Http\Controllers\Teams\TeamInvitationStoreController;
use App\Http\Controllers\Teams\TeamLeaveController;
use App\Http\Controllers\Teams\TeamMemberDestroyController;
use App\Http\Controllers\Teams\TeamMemberUpdateController;
use App\Http\Controllers\Teams\TeamStoreController;
use App\Http\Controllers\Teams\TeamSwitchController;
use App\Http\Controllers\Teams\TeamUpdateController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', ProfileEditController::class)->name('profile.edit');
    Route::patch('settings/profile', ProfileUpdateController::class)->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', ProfileDestroyController::class)->name('profile.destroy');

    Route::get('settings/security', SecurityEditController::class)
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', PasswordUpdateController::class)
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::get('settings/teams', TeamIndexController::class)->name('teams.index');
    Route::post('settings/teams', TeamStoreController::class)->name('teams.store');

    Route::middleware(EnsureTeamMembership::class)->group(function () {
        Route::get('settings/teams/{team}', TeamEditController::class)->name('teams.edit');
        Route::patch('settings/teams/{team}', TeamUpdateController::class)->name('teams.update');
        Route::delete('settings/teams/{team}', TeamDestroyController::class)->name('teams.destroy');
        Route::post('settings/teams/{team}/switch', TeamSwitchController::class)->name('teams.switch');
        Route::delete('settings/teams/{team}/leave', TeamLeaveController::class)->name('teams.leave');

        Route::patch('settings/teams/{team}/members/{user}', TeamMemberUpdateController::class)->name('teams.members.update');
        Route::delete('settings/teams/{team}/members/{user}', TeamMemberDestroyController::class)->name('teams.members.destroy');

        Route::post('settings/teams/{team}/invitations', TeamInvitationStoreController::class)->name('teams.invitations.store');
        Route::delete('settings/teams/{team}/invitations/{invitation}', TeamInvitationDestroyController::class)->name('teams.invitations.destroy');
    });
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
