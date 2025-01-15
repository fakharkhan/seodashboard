<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $adminUser->roles()->attach(Role::where('slug', 'admin')->first());

        // Create 3 provider users
        for ($i = 1; $i <= 3; $i++) {
            $provider = User::create([
                'name' => "Provider User {$i}",
                'email' => "provider{$i}@example.com",
                'password' => Hash::make('password'),
            ]);
            $provider->roles()->attach(Role::where('slug', 'provider')->first());
        }

        // Create 6 customer users
        for ($i = 1; $i <= 6; $i++) {
            $customer = User::create([
                'name' => "Customer User {$i}",
                'email' => "customer{$i}@example.com",
                'password' => Hash::make('password'),
            ]);
            $customer->roles()->attach(Role::where('slug', 'customer')->first());
        }
    }
} 