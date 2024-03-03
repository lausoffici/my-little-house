'use client';

import { Invoice } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import InvoiceStateBadge from '@/components/invoices/invoice-state-badge';
import ScholarshipInvoiceTrigger from '@/components/invoices/scholarship-invoice/scholarship-invoice-trigger';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { description, month, year, amount, id } = row.original;
      const invoiceFullDescription = `${description} ${getMonthName(month)} ${year} - ${formatCurrency(amount)}`;
      const invoiceId = id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <ScholarshipInvoiceTrigger invoiceFullDescription={invoiceFullDescription} invoiceId={invoiceId} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
