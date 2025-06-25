import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/app/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { BellIcon, CreditCardIcon, LogOut, Settings, UserCircleIcon } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                    href={route('profile.edit')}
                    as="button"
                    onClick={cleanup}
                    prefetch
                    className="block w-full bg-background text-foreground hover:bg-sidebar-accent hover:text-background focus:bg-sidebar-accent focus:text-background dark:text-white dark:focus:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background"

                    >
                    <Settings className="mr-2 text-inherit" />
                    Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="bg-background text-foreground hover:bg-sidebar-accent hover:text-background focus:bg-sidebar-accent focus:text-background dark:text-white dark:focus:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background"
                >
                    <UserCircleIcon className="mr-2 text-inherit" />
                    Account
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="bg-background text-foreground hover:bg-sidebar-accent hover:text-background focus:bg-sidebar-accent focus:text-background dark:text-white dark:focus:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background"
                >
                    <CreditCardIcon className="mr-2 text-inherit" />
                    Billing
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="bg-background text-foreground hover:bg-sidebar-accent hover:text-background focus:bg-sidebar-accent focus:text-background dark:text-white dark:focus:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background"
                >
                    <BellIcon className="mr-2 text-inherit" />
                    Notifications
                </DropdownMenuItem>
                </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link 
                    className="block w-full bg-background text-foreground hover:bg-sidebar-accent hover:text-background focus:bg-sidebar-accent focus:text-background dark:text-white dark:focus:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background"
                    method="post" href={route('logout')} as="button" onClick={handleLogout}
                >
                    <LogOut className="mr-2 text-inherit" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
