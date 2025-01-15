import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Project, User, Task } from '@/types';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Label } from '@/Components/ui/label';

interface ShowProps extends PageProps {
    project: Project;
    availableUsers: User[];
}

export default function Show({ auth, project, availableUsers }: ShowProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [processing, setProcessing] = useState(false);

    const { data: userData, setData: setUserData, post: postUser, processing: processingUser, errors: userErrors, reset: resetUser } = useForm({
        user_id: '',
    });

    const { data: taskData, setData: setTaskData, post: postTask, processing: processingTask, errors: taskErrors, reset: resetTask } = useForm({
        description: '',
        assigned_to: '',
        due_date: '',
    });

    const { data: editTaskData, setData: setEditTaskData, put: updateTask, processing: processingEditTask, errors: editTaskErrors, reset: resetEditTask } = useForm({
        description: '',
        assigned_to: '',
        due_date: '',
        status: '',
        completion_date: '',
    });

    const submitUser: FormEventHandler = (e) => {
        e.preventDefault();
        postUser(route('projects.assign-users', project.id), {
            onSuccess: () => resetUser(),
        });
    };

    const submitTask: FormEventHandler = (e) => {
        e.preventDefault();
        postTask(route('projects.tasks.store', project.id), {
            onSuccess: () => {
                resetTask();
                const dialog = document.getElementById('new-task-dialog') as HTMLDialogElement;
                dialog?.close();
            },
        });
    };

    const submitEditTask: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingTask) return;

        updateTask(route('projects.tasks.update', { project: project.id, task: editingTask.id }), {
            onSuccess: () => {
                resetEditTask();
                setEditingTask(null);
                const dialog = document.getElementById('edit-task-dialog') as HTMLDialogElement;
                dialog?.close();
            },
        });
    };

    const handleDelete = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            setProcessing(true);
            router.delete(route('projects.tasks.destroy', { project: project.id, task: taskId }), {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const openEditDialog = (task: Task) => {
        setEditingTask(task);
        setEditTaskData({
            description: task.description,
            assigned_to: task.assigned_to.toString(),
            due_date: task.due_date || '',
            status: task.status,
            completion_date: task.completion_date || '',
        });
        const dialog = document.getElementById('edit-task-dialog') as HTMLDialogElement;
        dialog?.showModal();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Project: {project.name}
                    </h2>
                    <Link href={route('projects.edit', project.id)}>
                        <Button>Edit Project</Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Project: ${project.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Project Details */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Project Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="text-gray-900 dark:text-gray-100">{project.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">URL</p>
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {project.url}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        {
                                            'not started': 'bg-gray-200 text-gray-800',
                                            'in progress': 'bg-blue-200 text-blue-800',
                                            'completed': 'bg-green-200 text-green-800',
                                            'on hold': 'bg-yellow-200 text-yellow-800',
                                        }[project.status]
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {project.owner.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Start Date
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {project.start_date
                                            ? format(new Date(project.start_date), 'MMM d, yyyy')
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        End Date
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                        {project.end_date
                                            ? format(new Date(project.end_date), 'MMM d, yyyy')
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                            {project.description && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Description
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                        {project.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Project Tasks */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Project Tasks</h3>
                                <Button
                                    onClick={() => {
                                        const dialog = document.getElementById('new-task-dialog') as HTMLDialogElement;
                                        dialog?.showModal();
                                    }}
                                >
                                    Add Task
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Completion Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell>{task.assignedUser?.name || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    {
                                                        'pending': 'bg-gray-200 text-gray-800',
                                                        'in progress': 'bg-blue-200 text-blue-800',
                                                        'completed': 'bg-green-200 text-green-800',
                                                    }[task.status]
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {task.due_date
                                                    ? format(new Date(task.due_date), 'MMM d, yyyy')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {task.completion_date
                                                    ? format(new Date(task.completion_date), 'MMM d, yyyy')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditDialog(task)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(task.id)}
                                                        disabled={processing}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* New Task Dialog */}
                            <dialog
                                id="new-task-dialog"
                                className="p-6 rounded-lg shadow-xl backdrop:bg-gray-800/50 dark:bg-gray-800"
                            >
                                <h3 className="text-lg font-medium mb-4">Add New Task</h3>
                                <form onSubmit={submitTask} className="space-y-4">
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={taskData.description}
                                            onChange={(e) => setTaskData('description', e.target.value)}
                                            rows={3}
                                        />
                                        {taskErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {taskErrors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="assigned_to">Assign To</Label>
                                        <Select
                                            value={taskData.assigned_to}
                                            onValueChange={(value) => setTaskData('assigned_to', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {project.users.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id.toString()}
                                                    >
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {taskErrors.assigned_to && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {taskErrors.assigned_to}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            type="date"
                                            id="due_date"
                                            value={taskData.due_date}
                                            onChange={(e) => setTaskData('due_date', e.target.value)}
                                        />
                                        {taskErrors.due_date && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {taskErrors.due_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const dialog = document.getElementById('new-task-dialog') as HTMLDialogElement;
                                                dialog?.close();
                                                resetTask();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processingTask}>
                                            Add Task
                                        </Button>
                                    </div>
                                </form>
                            </dialog>

                            {/* Edit Task Dialog */}
                            <dialog
                                id="edit-task-dialog"
                                className="p-6 rounded-lg shadow-xl backdrop:bg-gray-800/50 dark:bg-gray-800"
                            >
                                <h3 className="text-lg font-medium mb-4">Edit Task</h3>
                                <form onSubmit={submitEditTask} className="space-y-4">
                                    <div>
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editTaskData.description}
                                            onChange={(e) => setEditTaskData('description', e.target.value)}
                                            rows={3}
                                        />
                                        {editTaskErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {editTaskErrors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="edit-assigned_to">Assign To</Label>
                                        <Select
                                            value={editTaskData.assigned_to}
                                            onValueChange={(value) => setEditTaskData('assigned_to', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {project.users.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={user.id.toString()}
                                                    >
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {editTaskErrors.assigned_to && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {editTaskErrors.assigned_to}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="edit-status">Status</Label>
                                        <Select
                                            value={editTaskData.status}
                                            onValueChange={(value) => setEditTaskData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {editTaskErrors.status && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {editTaskErrors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="edit-due_date">Due Date</Label>
                                        <Input
                                            type="date"
                                            id="edit-due_date"
                                            value={editTaskData.due_date}
                                            onChange={(e) => setEditTaskData('due_date', e.target.value)}
                                        />
                                        {editTaskErrors.due_date && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {editTaskErrors.due_date}
                                            </p>
                                        )}
                                    </div>

                                    {editTaskData.status === 'completed' && (
                                        <div>
                                            <Label htmlFor="edit-completion_date">Completion Date</Label>
                                            <Input
                                                type="date"
                                                id="edit-completion_date"
                                                value={editTaskData.completion_date}
                                                onChange={(e) => setEditTaskData('completion_date', e.target.value)}
                                            />
                                            {editTaskErrors.completion_date && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {editTaskErrors.completion_date}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const dialog = document.getElementById('edit-task-dialog') as HTMLDialogElement;
                                                dialog?.close();
                                                setEditingTask(null);
                                                resetEditTask();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processingEditTask}>
                                            Update Task
                                        </Button>
                                    </div>
                                </form>
                            </dialog>
                        </div>
                    </div>

                    {/* Project Users */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Project Providers</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Add Provider Form */}
                            {availableUsers.length > 0 && (
                                <form onSubmit={submitUser} className="mt-6">
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <Label htmlFor="provider">Add Provider</Label>
                                            <Select
                                                value={userData.user_id}
                                                onValueChange={(value) => setUserData('user_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableUsers.map((user) => (
                                                        <SelectItem
                                                            key={user.id}
                                                            value={user.id.toString()}
                                                        >
                                                            {user.name} ({user.email})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {userErrors.user_id && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {userErrors.user_id}
                                                </p>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={processingUser}>
                                            Add Provider
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 