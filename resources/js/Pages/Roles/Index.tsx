import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Role } from '@/types';
import { useState } from 'react';

export default function Index({ auth, roles }: PageProps<{ roles: Role[] }>) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            setProcessing(true);
            router.delete(route('roles.destroy', id), {
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Roles
                    </h2>
                    <Link
                        href={route('roles.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Create Role
                    </Link>
                </div>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {roles.map((role) => (
                                        <tr key={role.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {role.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {role.slug}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route(
                                                        'roles.edit',
                                                        role.id,
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(role.id)
                                                    }
                                                    disabled={processing}
                                                    className="ml-4 text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
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