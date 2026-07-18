<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthShowRegisterController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $invitation = null;

        if ($code = $request->query('invitation')) {
            $invitationModel = TeamInvitation::where('code', $code)->first();
            if ($invitationModel) {
                $invitation = [
                    'code' => $code,
                    'teamName' => $invitationModel->team->name,
                ];
            }
        }

        return Inertia::render('auth/register', [
            'teamInvitation' => $invitation,
        ]);
    }
}
