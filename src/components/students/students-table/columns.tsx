'use client';

import { Student } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import DataTableColumnHeader from '@/components/ui/data-table/data-table-column-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Student>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'lastName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Apellido' />
    },
    {
        accessorKey: 'firstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Nombre' />
    },
    {
        accessorKey: 'courses',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Cursos' />
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const student = row.original;
            const id = student.id.toString();

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
                            <Link href={`/students/${id}`}>Ver detalles</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
