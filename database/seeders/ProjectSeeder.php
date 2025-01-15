<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use App\Models\Role;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Get customer and provider roles
        $customerRole = Role::where('slug', 'customer')->first();
        $providerRole = Role::where('slug', 'provider')->first();

        // Get users with customer role
        $customers = User::whereHas('roles', function ($query) use ($customerRole) {
            $query->where('roles.id', $customerRole->id);
        })->get();

        // Get users with provider role
        $providers = User::whereHas('roles', function ($query) use ($providerRole) {
            $query->where('roles.id', $providerRole->id);
        })->get();

        // Create projects for each customer
        foreach ($customers as $customer) {
            $numProjects = rand(1, 3); // Each customer gets 1-3 projects

            for ($i = 0; $i < $numProjects; $i++) {
                $project = Project::create([
                    'name' => fake()->company() . ' Project',
                    'description' => fake()->paragraph(),
                    'url' => fake()->url(),
                    'owner_id' => $customer->id,
                    'start_date' => fake()->dateTimeBetween('-1 month', '+1 month'),
                    'end_date' => fake()->dateTimeBetween('+2 months', '+6 months'),
                    'status' => fake()->randomElement(['not started', 'in progress', 'completed', 'on hold']),
                ]);

                // Add the owner (customer) as admin
                $project->users()->attach($customer->id, ['role' => 'admin']);

                // Assign 1-3 random providers to each project
                $projectProviders = $providers->random(rand(1, 3));
                foreach ($projectProviders as $provider) {
                    $project->users()->attach($provider->id, ['role' => 'provider']);
                }
            }
        }
    }
}
