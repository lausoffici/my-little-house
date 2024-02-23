'use client';

import { ColumnDef } from '@tanstack/react-table';

import { formatCurrency, formateDate } from '@/lib/utils';
import { ReceiptsWithItemsAndStudents } from '@/types';

import { DataTableColumnHeader } from '../ui/data-table';
import ReceiptsDialog from './receipts-dialog';

export const columns: ColumnDef<ReceiptsWithItemsAndStudents>[] = [
    {
        accessorKey: 'student',
        header: ({ column }) => {
            return <DataTableColumnHeader title='Apellido y Nombre' column={column} />;
        },
        cell: ({ row }) => {
            const student = row.original.student;
            const fullName = `${student.lastName} ${student.firstName} `;
            return <span>{fullName}</span>;
        },
        enableHiding: false,
        sortingFn: ({ original: a }, { original: b }) => {
            const lastNameA = a.student.lastName.toUpperCase();
            const lastNameB = b.student.lastName.toUpperCase();
            if (lastNameA < lastNameB) {
                return -1;
            }
            if (lastNameA > lastNameB) {
                return 1;
            }
            return 0;
        },
        sortDescFirst: false
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader title='Fecha de creación' column={column} />,
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            return <span>{formateDate(createdAt)}</span>;
        }
    },
    {
        accessorKey: 'total',
        header: ({ column }) => <DataTableColumnHeader title='Total' column={column} />,
        cell: ({ row }) => {
            const total = row.original.total;
            return <span>{formatCurrency(total)}</span>;
        }
    },
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
        cell: ({ row }) => {
            const receipt = row.original;
            return <ReceiptsDialog receipt={receipt} />;
        }
    }
];
