import * as React from "react"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        name: string;
        size?: 'sm' | 'md' | 'lg';
    }
>(({ className, name, size = 'md', ...props }, ref) => {
    const initials = getInitials(name);
    const sizeClasses = {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
    };

    return (
        <div
            ref={ref}
            className={cn(
                "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            <span className="font-medium text-muted-foreground">
                {initials}
            </span>
        </div>
    );
});
Avatar.displayName = "Avatar";

export { Avatar }; 