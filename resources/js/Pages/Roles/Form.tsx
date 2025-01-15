import { Role } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    role?: Role;
    action: string;
}

export default function RoleForm({ role, action }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
        slug: role?.slug ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (role) {
            put(route('roles.update', role.id));
        } else {
            post(route('roles.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-gray-700"
                >
                    Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {action}
                </button>
            </div>
        </form>
    );
} 