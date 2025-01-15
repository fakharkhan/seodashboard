<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $appends = ['assignedUser'];
    


    protected $fillable = [
        'project_id',
        'assigned_to',
        'description',
        'status',
        'due_date',
        'completion_date',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'due_date' => 'date',
    ];

    /**
     * Get the project that owns the task.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user assigned to the task.
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function getAssignedUserAttribute()
    {
        return $this->assignedUser()->first();
    }
}
