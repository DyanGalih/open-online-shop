<?php

namespace App\Http\Controllers\Teams;

use App\Data\TeamUpdateData;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Services\TeamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TeamUpdateController extends Controller
{
    public function __construct(
        protected TeamService $teamService,
    ) {}

    /**
     * Update the specified team.
     */
    public function __invoke(TeamUpdateData $data, Team $team): RedirectResponse
    {
        Gate::authorize('update', $team);

        $team = $this->teamService->updateTeam($team, $data->name);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team updated.')]);

        return to_route('teams.edit', ['team' => $team->slug]);
    }
}
