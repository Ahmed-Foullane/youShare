<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyMethodOverride
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the request has a X-HTTP-Method-Override header
        if ($request->hasHeader('X-HTTP-Method-Override')) {
            $method = strtoupper($request->header('X-HTTP-Method-Override'));
            $request->setMethod($method);
        }
        
        // Check for _method field in FormData or JSON body
        if ($request->isMethod('POST') && $request->has('_method')) {
            $method = strtoupper($request->input('_method'));
            
            // Log the method override for debugging
            \Log::info('Method override detected', [
                'original_method' => $request->method(),
                'override_method' => $method,
                'uri' => $request->getRequestUri(),
            ]);
            
            $request->setMethod($method);
        }
        
        return $next($request);
    }
}
