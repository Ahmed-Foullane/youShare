<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentOnlyMiddleware
{
    /**
     * Handle an incoming request.
     * This middleware prevents admin users from accessing student-specific routes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // If the user is an admin, they should not access student routes
            if ($user->role && ($user->role->id === 1 || $user->role->name === 'Admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin users cannot access student routes',
                ], 403);
            }
        }

        return $next($request);
    }
}
