'use client';

import { Invoice } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import InvoiceStateBadge from '@/components/invoices/invoice-state-badge';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { formatCurrency, getMonthName } from '@/lib/utils';

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Descripción' />
  },
  {
    accessorKey: 'month',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mes' />,
    cell: ({ row }) => <span>{getMonthName(row.original.month)}</span>
  },
  {
    accessorKey: 'year',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Año' />
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Importe' />,
    cell: ({ row }) => <span>{formatCurrency(row.original.amount)}</span>
  },
  {
    accessorKey: 'state',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Estado' />,
    cell: ({ row }) => <InvoiceStateBadge state={row.original.state} />
  }
];
