'use client';

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import React from 'react';

import { ReceiptsWithItemsAndStudents } from '@/types';

import DataTable from '../ui/data-table/data-table';
import { columns } from './columns';

interface ReceiptsTableProps {
    receiptsPromise: Promise<ReceiptsWithItemsAndStudents[]>;
}

export default function ReceiptsTable({ receiptsPromise }: ReceiptsTableProps) {
    const receipts = React.use(receiptsPromise);

    const table = useReactTable<ReceiptsWithItemsAndStudents>({
        data: receipts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return <DataTable table={table} columns={columns} />;
}
