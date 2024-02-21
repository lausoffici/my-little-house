'use client';

import { Item } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Concepto' />
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Importe' />
    },

    {
        accessorKey: 'receipt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Comprobante' />,
        cell: ({ row }) => {
            const value = row.original.receipt;

            // return (
            //     <Link href={`/receipts/${value.id}`}>
            //         <a className='text-blue-600'>{value.id}</a>
            //     </Link>
            // );
        }
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;
            const id = item.id.toString();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link href={`/`}>Ir al Comprobante</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
