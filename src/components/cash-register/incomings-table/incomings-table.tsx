'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getIncomingsList } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';
import { CashRegisterIncomingItem } from '@/types';

import { columns } from './columns';

export const filterableColumns = ['studentByCourse'];
export const searchableColumns = ['lastName'];

type StudentsTableProps = {
    incomingsPromise: ReturnType<typeof getIncomingsList>;
};

export default function IncomingsTable({ incomingsPromise }: StudentsTableProps) {
    const { data, totalPages, totalAmount } = React.use(incomingsPromise);

    const incomingTotal = totalAmount?._sum?.amount ?? 0;

    const table = useURLManagedDataTable<CashRegisterIncomingItem>({
        data,
        columns,
        pageCount: totalPages,
        searchableColumns,
        filterableColumns
    });

    return (
        <>
            <div className='flex items-center mb-2'>
                <h2 className='text-xl font-bold mr-2'>Entradas</h2>
                <Badge variant='outline' className='text-foreground w-fit text-sm'>
                    {formatCurrency(incomingTotal)}
                </Badge>
            </div>

            <DataTable table={table} columns={columns} />
        </>
    );
}
