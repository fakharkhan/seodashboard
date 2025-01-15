<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $middleware = [
        // ... existing middlewares
        \App\Http\Middleware\CheckRole::class,
    ];

    /**
     * The application's route middleware aliases.
     *
     * Aliases may be used instead of class names to assign middleware to groups or
     * to assign middleware to routes.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        // ... existing middlewares
        'role' => \App\Http\Middleware\CheckRole::class,
    ];
} 