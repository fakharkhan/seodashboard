<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }
} 