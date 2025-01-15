import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Task } from '@/types';
import { format } from 'date-fns';

export default function Index({ auth, tasks }: PageProps<{ tasks: Task[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tasks
                    </h2>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Project
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Provider
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Completion Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route('projects.show', task.project_id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {task.project?.name}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {task.assignedUser?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.description}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : task.status === 'in progress'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {task.completion_date
                                                    ? format(new Date(task.completion_date), 'MMM d, yyyy')
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 