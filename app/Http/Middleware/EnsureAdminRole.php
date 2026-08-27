<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Unauthorized. Administrative privileges required.');
        }

        // Check if user is explicitly flagged as admin or has admin capability
        if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return $next($request);
        }

        if (isset($user->is_admin) && (bool) $user->is_admin) {
            return $next($request);
        }

        // Check current team role if applicable
        if ($user->currentTeam && $user->ownsTeam($user->currentTeam)) {
            return $next($request);
        }

        abort(403, 'Unauthorized. Administrative privileges required.');
    }
}
