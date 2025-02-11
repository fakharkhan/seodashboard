import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Task {
    id: number;
    project_id: number;
    assigned_to: number;
    description: string;
    status: 'pending' | 'in progress' | 'completed';
    due_date: string | null;
    completion_date: string | null;
    assignedUser: User;
    project?: Project;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    url: string;
    owner_id: number;
    start_date: string | null;
    end_date: string | null;
    status: 'not started' | 'in progress' | 'completed' | 'on hold';
    created_at: string;
    updated_at: string;
    owner: User;
    users: {
        id: number;
        name: string;
        email: string;
        pivot: {
            role: 'admin' | 'provider' | 'customer';
        };
    }[];
    tasks: Task[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
