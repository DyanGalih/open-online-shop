<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamIndexController extends Controller
{
    /**
     * Display a listing of the user's teams.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('teams/index', [
            'teams' => $user->toUserTeams(includeCurrent: true),
        ]);
    }
}
