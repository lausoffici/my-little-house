'use client';
import { usePathname } from 'next/navigation';
import { FiSmile, FiMonitor, FiLock } from 'react-icons/fi';
import Logo from './Logo';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

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
    return (
        <Link href={href} passHref>
            <div
                className={`${
                    path === href
                        ? 'border-r-2 font-bold opacity-100'
                        : path === '/'
                        ? 'opacity-100'
                        : 'border-r-0 font-normal opacity-35'
                } flex border-r-brand-900  my-4 `}
            >
                <a className='flex ml-7 gap-5 justify-start items-center text-brand-900 cursor-pointer'>
                    {icon}
                    {children}
                </a>
            </div>
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
        <div className='box-border w-96 h-full bg-slate-50 flex flex-col items-center justify-between pt-2 pb-9'>
            <div>
                <div className='p-5'>
                    <Logo />
                </div>
                <nav className='w-full px-2'>
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
