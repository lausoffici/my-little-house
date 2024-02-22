'use client';

import { Invoice } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { capitalizeFirstLetter, getMonthName } from '@/lib/utils';
import { invoicesStatusType } from '@/types';

const invoicesStatus: invoicesStatusType = {
    P: {
        text: 'Pagado',
        color: 'success'
    },
    B: {
        text: 'Becado',
        color: 'informative'
    },
    I: {
        text: 'Pendiente',
        color: 'destructive'
    }
};

export const columns: ColumnDef<Invoice>[] = [
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
        accessorKey: 'description',
        header: ({ column }) => <Label className='font-bold'>Descripción</Label>
    },
    {
        accessorKey: 'month',
        header: ({ column }) => <Label className='font-bold'>Mes</Label>,
        cell: ({ row }) => {
            const monthNumber = row.original;
            const monthName = getMonthName(+monthNumber.month);

            return <span>{capitalizeFirstLetter(monthName)}</span>;
        },
        enableSorting: true
    },
    {
        accessorKey: 'year',
        header: ({ column }) => <Label className='font-bold'>Año</Label>
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <Label className='font-bold'>Precio</Label>,
        cell: ({ row }) => {
            const amount = row.original.amount;
            return <Label className='font-bold'>{`$${amount}`}</Label>;
        }
    },
    {
        accessorKey: 'state',
        header: ({ column }) => <Label className='font-bold'> Estado</Label>,
        cell: ({ row }) => {
            const invoice = row.original;
            return <Badge variant={invoicesStatus[invoice.state].color}>{invoicesStatus[invoice.state].text}</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Abrir Menú</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <span>Ver comprobante</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
