'use client';

import { Expenditure } from '@prisma/client';
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
import { getExpendituresByDate } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';

import { columns } from './columns';

type OutcomingsTableProps = {
    outcomingsPromise: ReturnType<typeof getExpendituresByDate>;
};

export default function OutcomingsTable({ outcomingsPromise }: OutcomingsTableProps) {
    const { data, totalAmount } = React.use(outcomingsPromise);

    const table = useReactTable<Expenditure>({
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
            <div className='flex items-center mb-2'>
                <h2 className='text-xl font-bold mr-2'>Salidas</h2>
                <Badge variant='outline' className='text-sm'>
                    {formatCurrency(totalAmount)}
                </Badge>
            </div>

            <DataTable table={table} columns={columns} withRowSelection={false} />
        </>
    );
}
