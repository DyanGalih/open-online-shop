import AppLogoIcon from '@/components/app-logo-icon';
import { useSidebar } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage<{ name: string }>().props;
    const { state } = useSidebar();

    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            {state === 'expanded' && (
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">
                        {name}
                    </span>
                </div>
            )}
        </div>
    );
}
