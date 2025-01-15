import { Head, Link, router } from '@inertiajs/react';
import { Project } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { format } from 'date-fns';

interface ProjectsPageProps extends PageProps {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ auth, projects }: ProjectsPageProps) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            setProcessing(true);
            router.delete(route('projects.destroy', id), {
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Projects
                    </h2>
                    <Link href={route('projects.create')}>
                        <Button>Create Project</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.data.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {project.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
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
                                            </TableCell>
                                            <TableCell>
                                                {project.start_date
                                                    ? format(new Date(project.start_date), 'MMM d, yyyy')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{project.owner.name}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('projects.edit', project.id)}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        disabled={processing}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 