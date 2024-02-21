'use client';

import { Expenditure } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import { formatCurrency } from '@/lib/utils';

export const columns: ColumnDef<Expenditure>[] = [
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Concepto' />
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Importe' />,
        cell: ({ row }) => {
            const { amount } = row.original;
            return <span>{formatCurrency(amount)}</span>;
        }
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Hora' />,
        cell: ({ row }) => {
            const { createdAt } = row.original;
            const locales = 'default';
            const options = {
                hour: '2-digit' as const,
                minute: '2-digit' as const,
                second: '2-digit' as const,
                hour12: false
            };
            return <span>{new Date(createdAt).toLocaleTimeString(locales, options)}</span>;
        }
    }
];
