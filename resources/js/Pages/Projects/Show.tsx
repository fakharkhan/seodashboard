import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Project, User } from '@/types';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';
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
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('projects.assign-users', project.id), {
            onSuccess: () => reset(),
        });
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
                                <form onSubmit={submit} className="mt-6">
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <Label htmlFor="provider">Add Provider</Label>
                                            <Select
                                                value={data.user_id}
                                                onValueChange={(value) => setData('user_id', value)}
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
                                            {errors.user_id && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.user_id}
                                                </p>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={processing}>
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