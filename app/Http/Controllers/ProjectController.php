<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['owner', 'users'])
            ->when(auth()->user()->isCustomer(), function ($query) {
                $query->whereHas('users', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = User::whereHas('roles', function ($query) {
            $query->where('slug', 'customer');
        })->get(['id', 'name', 'email']);

        return Inertia::render('Projects/Create', [
            'customers' => $customers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {

        $project->load(['owner', 'users', 'tasks']);
       
        $availableUsers = User::whereNotIn('id', $project->users->pluck('id'))
            ->whereHas('roles', function ($query) {
                $query->where('slug', 'provider');
            })
            ->get(['id', 'name', 'email']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'availableUsers' => $availableUsers,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $project->load(['owner']);
        
        $customers = User::whereHas('roles', function ($query) {
            $query->where('slug', 'customer');
        })->get(['id', 'name', 'email']);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'customers' => $customers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function assignUsers(Request $request, Project $project)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // Verify the user is a provider
        $user = User::findOrFail($request->user_id);
        if (!$user->isProvider()) {
            return back()->with('error', 'Selected user must be a provider.');
        }

        // Attach the user with provider role
        $project->users()->attach($request->user_id, ['role' => 'provider']);

        return back()->with('success', 'Provider assigned successfully.');
    }
}
