import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { ThemeModeToggle } from './theme-mode-toggle';

export default function TopNavigationBar() {
    return (
        <header className='flex w-full h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-gray-100/40 dark:bg-gray-800/40 px-4 py-2 flex-shrink-0 sticky top-0'>
            <div className='w-full flex-1'>
                <form>
                    <div className='relative'>
                        <MagnifyingGlassIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
                        <Input
                            className='w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950'
                            placeholder='Buscar...'
                            type='search'
                        />
                    </div>
                </form>
            </div>
            <ThemeModeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className='rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800'
                        size='icon'
                        variant='ghost'
                    >
                        LS
                        <span className='sr-only'>Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
