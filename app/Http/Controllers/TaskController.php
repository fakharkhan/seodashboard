<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'required|date',
        ]);

        // Ensure the assigned user is a provider for this project
        $project->load('users');
        if (!$project->users->contains($validated['assigned_to'])) {
            return back()->withErrors([
                'assigned_to' => 'The selected user must be a provider for this project.',
            ]);
        }

        $task = $project->tasks()->create([
            'description' => $validated['description'],
            'assigned_to' => $validated['assigned_to'],
            'due_date' => $validated['due_date'],
            'status' => 'pending',
        ]);

        return back();
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,in progress,completed',
            'completion_date' => $request->status === 'completed' ? 'required|date' : 'nullable|date',
        ]);

        // Ensure the task belongs to the project
        if ($task->project_id !== $project->id) {
            return back()->withErrors(['task' => 'This task does not belong to the project.']);
        }

        // Ensure the assigned user is a provider for this project
        $project->load('users');
        if (!$project->users->contains($validated['assigned_to'])) {
            return back()->withErrors([
                'assigned_to' => 'The selected user must be a provider for this project.',
            ]);
        }

        $task->update($validated);

        return back();
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        // Ensure the task belongs to the project
        if ($task->project_id !== $project->id) {
            return back()->withErrors(['task' => 'This task does not belong to the project.']);
        }

        $task->delete();

        return back();
    }
}
