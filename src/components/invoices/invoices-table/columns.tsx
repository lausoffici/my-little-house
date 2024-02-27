'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/ui/data-table';
import { getExpiredInvoiceList } from '@/lib/invoices';
import { formatCurrency, formateDate, getMonthName } from '@/lib/utils';

import InvoiceStateBadge from '../invoice-state-badge';

export const columns: ColumnDef<Awaited<ReturnType<typeof getExpiredInvoiceList>>['data'][0]>[] = [
    {
        accessorKey: 'student',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Estudiante' />,
        cell: ({ row }) => (
            <div>
                {row.original.student.firstName} {row.original.student.lastName}
            </div>
        ),
        enableSorting: false
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Descripción' />
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Importe' />,
        cell: ({ row }) => <span>{formatCurrency(row.original.amount)}</span>
    },
    {
        accessorKey: 'state',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Estado' />,
        cell: ({ row }) => <InvoiceStateBadge state={row.original.state} />,
        enableSorting: false
    },
    {
        accessorKey: 'month',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Mes' />,
        cell: ({ row }) => <span>{getMonthName(row.original.month)}</span>,
        enableSorting: false
    },
    {
        accessorKey: 'year',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Año' />
    },
    {
        accessorKey: 'expiredAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Vencimiento' />,
        cell: ({ row }) => <span>{formateDate(row.original.expiredAt)}</span>
    }
];
