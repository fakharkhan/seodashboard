<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Administrator', 'slug' => 'admin'],
            ['name' => 'Service Provider', 'slug' => 'provider'],
            ['name' => 'Customer', 'slug' => 'customer'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
} 