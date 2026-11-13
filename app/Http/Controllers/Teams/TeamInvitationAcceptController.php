<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\RespondToTeamInvitationRequest;
use App\Models\TeamInvitation;
use App\Services\TeamService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TeamInvitationAcceptController extends Controller
{
    public function __construct(
        protected TeamService $teamService,
    ) {}

    /**
     * Accept the invitation.
     */
    public function __invoke(RespondToTeamInvitationRequest $request, TeamInvitation $invitation): RedirectResponse
    {
        $this->teamService->acceptInvitation($invitation, $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation accepted.')]);

        return to_route('dashboard');
    }
}
