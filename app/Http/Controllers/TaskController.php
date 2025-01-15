<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        return Inertia::render('Tasks/Index', [
            'tasks' => Task::with(['project', 'assignedUser'])->get()
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'assigned_to' => 'required|exists:users,id',
            'status' => 'required|in:pending,in progress,completed',
            'due_date' => 'nullable|date',
            'completion_date' => 'nullable|date',
        ]);

        $project->tasks()->create($validated);

        return redirect()->back()
            ->with('message', 'Task created successfully.');
    }

    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'assigned_to' => 'required|exists:users,id',
            'status' => 'required|in:pending,in progress,completed',
            'due_date' => 'nullable|date',
            'completion_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return redirect()->back()
            ->with('message', 'Task updated successfully.');
    }

    public function destroy(Project $project, Task $task)
    {
        $task->delete();

        return redirect()->back()
            ->with('message', 'Task deleted successfully.');
    }
}
