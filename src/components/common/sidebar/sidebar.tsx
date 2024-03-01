'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiDollarSign, FiLock, FiMonitor, FiSmile } from 'react-icons/fi';
import { TfiReceipt } from 'react-icons/tfi';

import { cn } from '@/lib/utils';

import Logo from './logo';

const LinkItems = [
  { name: 'Estudiantes', icon: <FiSmile />, href: '/students' },
  { name: 'Cursos', icon: <FiMonitor />, href: '/courses' },
  { name: 'Caja', icon: <FiLock />, href: '/cash-register' },
  { name: 'Comprobantes', icon: <TfiReceipt />, href: '/receipts' },
  { name: 'Vencimientos', icon: <FiDollarSign />, href: '/expirations?sortBy=expiredAt&sortOrder=asc' }
];

interface NavItemProps {
  children: string;
  href: string;
  icon: JSX.Element;
  path: string;
}

const NavItem = ({ children, href, icon, path }: NavItemProps) => {
  const isActive = path.startsWith(href.split('?')[0]);

  return (
    <Link
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:text-black',
        isActive && 'bg-muted text-foreground'
      )}
      href={href}
    >
      {icon}
      {children}
    </Link>
  );
};

const Ilustration = ({ path }: { path: string }) => {
  const imagesByPath: Record<string, string> = {
    '/students': '/assets/students.png',
    '/courses': '/assets/courses.png',
    '/cash-register': '/assets/cash-register.png',
    '/receipts': '/assets/receipts.png',
    '/expirations': '/assets/expirations.png'
  };
  const src = imagesByPath[path] ?? '/assets/cat.png';
  return <Image src={src} width={200} height={200} alt='Ilustration' />;
};

export default function Sidebar() {
  const path = usePathname();
  return (
    <div className='w-60 flex flex-col border-r bg-gray-100/40 items-center justify-between'>
      <div className='w-full'>
        <div className='h-[60px] grid place-content-center'>
          <Logo />
        </div>
        <nav className='grid items-start px-4 py-6 text-sm font-medium'>
          {LinkItems.map(({ name, icon, href }) => (
            <NavItem key={name} icon={icon} href={href} path={path}>
              {name}
            </NavItem>
          ))}
        </nav>
      </div>
      <div className='my-4'>
        <Ilustration path={path} />
      </div>
    </div>
  );
}
