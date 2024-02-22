'use client';

import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { formatCurrency } from '@/lib/utils';
import { CashRegisterIncomingItem } from '@/types';

export const columns: ColumnDef<CashRegisterIncomingItem>[] = [
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
        accessorKey: 'receiptId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Comprobante' />,
        cell: ({ row }) => {
            const { receiptId } = row.original;
            return (
                <Link href={`/receipts/${receiptId}`}>
                    <Badge>
                        <div className='flex gap-1'>
                            #{receiptId} <ExternalLinkIcon />
                        </div>
                    </Badge>
                </Link>
            );
        }
    },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Alumno' />
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Hora' />,
        cell: ({ row }) => {
            const { createdAt } = row.original;
            const locales = 'default';
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            } as const;
            return <span>{new Date(createdAt).toLocaleTimeString(locales, options)}</span>;
        }
    }
];
