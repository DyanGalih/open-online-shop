<?php

namespace App\Services;

use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeamService
{
    /**
     * Update the team name with row-level locking inside an atomic transaction.
     */
    public function updateTeam(Team $team, string $name): Team
    {
        return DB::transaction(function () use ($team, $name) {
            $lockedTeam = Team::whereKey($team->id)->lockForUpdate()->firstOrFail();
            $lockedTeam->update(['name' => $name]);

            return $lockedTeam;
        });
    }

    /**
     * Delete the team and reassign affected users' current team inside an atomic transaction.
     */
    public function deleteTeam(Team $team, User $authUser): void
    {
        DB::transaction(function () use ($team, $authUser) {
            $affectedUsers = User::where('current_team_id', $team->id)
                ->where('id', '!=', $authUser->id)
                ->get();

            foreach ($affectedUsers as $affectedUser) {
                $affectedUser->switchTeam($affectedUser->personalTeam());
            }

            $team->invitations()->delete();
            $team->memberships()->delete();
            $team->delete();
        });
    }

    /**
     * Accept a team invitation and attach membership inside an atomic transaction.
     */
    public function acceptInvitation(TeamInvitation $invitation, User $user): Team
    {
        return DB::transaction(function () use ($invitation, $user) {
            $team = $invitation->team;

            $team->memberships()->firstOrCreate(
                ['user_id' => $user->id],
                ['role' => $invitation->role],
            );

            $invitation->update(['accepted_at' => now()]);

            $user->switchTeam($team);

            return $team;
        });
    }

    /**
     * Remove user membership when leaving a team.
     */
    public function leaveTeam(Team $team, User $user): void
    {
        $team->memberships()
            ->where('user_id', $user->id)
            ->delete();
    }
}
