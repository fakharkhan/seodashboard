<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::with(['users' => function($query) {
            $query->whereHas('roles', function($q) {
                $q->where('slug', 'provider');
            });
        }])->get();

        foreach ($projects as $project) {
            // Only create tasks if the project has providers
            if ($project->users->isNotEmpty()) {
                // Create 3-7 tasks per project
                $numTasks = rand(3, 7);
                
                for ($i = 0; $i < $numTasks; $i++) {
                    // Randomly select a provider from the project
                    $provider = $project->users->random();
                    
                    // Generate a random due date between now and 30 days from now
                    $dueDate = Carbon::now()->addDays(rand(1, 30));
                    
                    // Randomly decide if task is completed
                    $isCompleted = (bool)rand(0, 1);
                    
                    Task::create([
                        'project_id' => $project->id,
                        'assigned_to' => $provider->id,
                        'description' => "Task " . ($i + 1) . " for project: " . $project->name,
                        'status' => $isCompleted ? 'completed' : (rand(0, 1) ? 'in progress' : 'pending'),
                        'due_date' => $dueDate,
                        'completion_date' => $isCompleted ? $dueDate->copy()->subDays(rand(1, 5)) : null,
                    ]);
                }
            }
        }
    }
}
