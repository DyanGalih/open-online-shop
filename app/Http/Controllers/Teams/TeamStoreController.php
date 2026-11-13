<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\CreateTeam;
use App\Data\TeamStoreData;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamStoreController extends Controller
{
    /**
     * Store a newly created team.
     */
    public function __invoke(Request $request, TeamStoreData $data, CreateTeam $createTeam): RedirectResponse
    {
        $team = $createTeam->handle($request->user(), $data->name);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team created.')]);

        return to_route('teams.edit', ['team' => $team->slug]);
    }
}
