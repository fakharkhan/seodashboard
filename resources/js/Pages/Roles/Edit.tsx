import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Role } from '@/types';
import RoleForm from './Form';

export default function Edit({ auth, role }: PageProps<{ role: Role }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Role
                </h2>
            }
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <RoleForm role={role} action="Update" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 