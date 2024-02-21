'use client';

import { Item } from '@prisma/client';
import React from 'react';

import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getIncomingsList } from '@/lib/cash-register';

import { columns } from './columns';

export const filterableColumns = ['studentByCourse'];
export const searchableColumns = ['lastName'];

type StudentsTableProps = {
    incomingsPromise: ReturnType<typeof getIncomingsList>;
};

export default function IncomingsTable({ incomingsPromise }: StudentsTableProps) {
    const { data, totalPages } = React.use(incomingsPromise);

    console.log(data);

    const table = useURLManagedDataTable<Item>({
        data,
        columns,
        pageCount: totalPages,
        searchableColumns,
        filterableColumns
    });

    return (
        <>
            <div className='flex items-center py-4'>
                {/* <StudentsTableFilters table={table} courseOptions={courseOptions} /> */}
            </div>

            <DataTable table={table} columns={columns} />
        </>
    );
}
