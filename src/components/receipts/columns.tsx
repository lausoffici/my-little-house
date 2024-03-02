'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { paymentMethodLabels } from '@/components/receipts/receipt-dialog';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { formatCurrency, formatTime } from '@/lib/utils';
import { ReceiptWithStudent } from '@/types';

import { ReceiptBadge } from './receipt-badge';

export const getReceiptColumns: (isInReceiptsPage?: boolean) => ColumnDef<ReceiptWithStudent>[] = (
  isInReceiptsPage = false
) => [
  {
    accessorKey: 'studentId',
    header: ({ column }) => <DataTableColumnHeader title='Estudiante' column={column} />,
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <Link className='underline' href={`/students/${student.id}`}>
          {student.firstName} {student.lastName}
        </Link>
      );
    },
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Hora' />,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <span>{formatTime(createdAt)}</span>;
    }
  },
  {
    accessorKey: 'total',
    header: ({ column }) => <DataTableColumnHeader title='Total' column={column} />,
    cell: ({ row }) => <span>{formatCurrency(row.original.total)}</span>
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Metodo de pago' />,
    cell: ({ row }) => {
      const { paymentMethod } = row.original;
      return <span>{paymentMethodLabels[paymentMethod]}</span>;
    }
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Comprobante' />,
    cell: ({ row }) => <ReceiptBadge receiptId={row.original.id} isInReceiptsPage={isInReceiptsPage} />
  }
];
