import { Role, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    user?: User;
    roles: Role[];
    action: string;
}

export default function UserForm({ user, roles, action }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        roles: user?.roles?.map(role => role.id) ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (user) {
            put(route('users.update', user.id));
        } else {
            post(route('users.store'));
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
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password {user && '(leave blank to keep current)'}
                </label>
                <input
                    type="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Roles
                </label>
                <div className="mt-2 space-y-2">
                    {roles.map((role) => (
                        <div key={role.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`role-${role.id}`}
                                checked={data.roles.includes(role.id)}
                                onChange={(e) => {
                                    const newRoles = e.target.checked
                                        ? [...data.roles, role.id]
                                        : data.roles.filter((id) => id !== role.id);
                                    setData('roles', newRoles);
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor={`role-${role.id}`}
                                className="ml-2 text-sm text-gray-700"
                            >
                                {role.name}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.roles && (
                    <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
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