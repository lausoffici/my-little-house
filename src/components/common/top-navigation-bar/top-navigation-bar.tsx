'use client';

import { DefaultSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { SearchBar } from './search-bar';
import { ThemeModeToggle } from './theme-mode-toggle';

type TopNavigationBarProps = {
  user: DefaultSession['user'];
};

export default function TopNavigationBar({ user }: TopNavigationBarProps) {
  return (
    <header className='flex w-full h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-gray-100/40 dark:bg-gray-800/40 px-4 py-2 flex-shrink-0 sticky top-0 z-10'>
      <div className='w-full flex-1'>
        <SearchBar />
      </div>

      <ThemeModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='rounded-full border border-gray-200 w-9 h-9 dark:border-gray-800'
            size='icon'
            variant='ghost'
          >
            {user?.image && <Image className='rounded-full' src={user?.image} alt='' height={32} width={32} />}
            <span className='sr-only'>Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
            Cerrar Sesion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
