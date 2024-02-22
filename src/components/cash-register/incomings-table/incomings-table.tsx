'use client';

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import { getIncomingsListByDate } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';
import { CashRegisterIncomingItem } from '@/types';

import { columns } from './columns';

type IncomingsTableProps = {
    incomingsPromise: ReturnType<typeof getIncomingsListByDate>;
};

export default function IncomingsTable({ incomingsPromise }: IncomingsTableProps) {
    const { data, totalAmount } = React.use(incomingsPromise);

    const table = useReactTable<CashRegisterIncomingItem>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableRowSelection: false
    });

    return (
        <>
            <div className='flex items-center mb-2 min-h-[32px]'>
                <h2 className='text-xl font-bold mr-2'>Entradas:</h2>
                <Badge variant='outline' className='text-sm'>
                    {formatCurrency(totalAmount)}
                </Badge>
            </div>

            <DataTable table={table} columns={columns} withRowSelection={false} />
        </>
    );
}
