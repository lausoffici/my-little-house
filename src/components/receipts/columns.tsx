'use client';

import { ColumnDef } from '@tanstack/react-table';

import { formatCurrency, formateDate } from '@/lib/utils';
import { ReceiptsWithStudents } from '@/types';

import { DataTableColumnHeader } from '../ui/data-table';
import { ReceiptDialogTrigger } from './receipt-dialog-trigger';

export const columns: ColumnDef<ReceiptsWithStudents>[] = [
    {
        accessorKey: 'studentId',
        header: ({ column }) => {
            return <DataTableColumnHeader title='Nombre y Apellido' column={column} />;
        },
        cell: ({ row }) => {
            const student = row.original.student;
            return (
                <span>
                    {student.firstName}
                    {student.lastName}
                </span>
            );
        },
        enableHiding: false
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader title='Fecha de creación' column={column} />,
        cell: ({ row }) => <span>{formateDate(row.original.createdAt)}</span>
    },
    {
        accessorKey: 'total',
        header: ({ column }) => <DataTableColumnHeader title='Total' column={column} />,
        cell: ({ row }) => <span>{formatCurrency(row.original.total)}</span>
    },
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
        cell: ({ row }) => <ReceiptDialogTrigger receiptId={row.original.id} />
    }
];
