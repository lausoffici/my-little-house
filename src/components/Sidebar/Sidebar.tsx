'use client';
import { usePathname } from 'next/navigation';
import { FiSmile, FiMonitor, FiLock } from 'react-icons/fi';
import Logo from './Logo';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const LinkItems = [
    { name: 'Estudiantes', icon: <FiSmile />, href: '/students' },
    { name: 'Cursos', icon: <FiMonitor />, href: '/courses' },
    { name: 'Caja', icon: <FiLock />, href: '/cash-register' }
];

interface NavItemProps {
    children: string;
    href: string;
    icon: JSX.Element;
    path: string;
}

const NavItem = ({ children, href, icon, path }: NavItemProps) => {
    const isActive = path === href;

    return (
        <Link
            className={cn(
                isActive && 'bg-gray-100',
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900'
            )}
            href={href}
        >
            {icon}
            {children}
        </Link>
    );
};

const Ilustration = ({ path }: { path: string }) => {
    return (
        <Image
            className=''
            src={path === '/' ? '/assets/book.png' : `/assets${path}.png`}
            width={250}
            height={250}
            alt={path.slice(0, 1)}
        />
    );
};

export default function Sidebar() {
    const path = usePathname();
    return (
        <div className='box-border w-72 h-full bg-slate-50 flex flex-col items-center justify-between pt-2 pb-9'>
            <div className='w-full'>
                <div className='py-4 mb-10'>
                    <Logo />
                </div>
                <nav className='grid items-start px-4 text-sm font-medium'>
                    {LinkItems.map(({ name, icon, href }) => (
                        <NavItem key={name} icon={icon} href={href} path={path}>
                            {name}
                        </NavItem>
                    ))}
                </nav>
            </div>
            <div>
                <Ilustration path={path} />
            </div>
        </div>
    );
}
