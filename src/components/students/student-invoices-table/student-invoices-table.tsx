'use client';

import { Invoice } from '@prisma/client';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

import DataTable from '@/components/ui/data-table/data-table';

import { columns } from './columns';

type StudentInvoicesTableProps = {
    invoicesPromise: Promise<Invoice[]>;
};

export default function StudentInvoicesTable({ invoicesPromise }: StudentInvoicesTableProps) {
    const invoices = React.use(invoicesPromise);

    const sortedInvoices = [...invoices].sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        } else {
            return b.month - a.month;
        }
    });

    const table = useReactTable<Invoice>({
        data: sortedInvoices,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return <DataTable table={table} columns={columns} />;
}
