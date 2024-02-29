'use client';

import React from 'react';

import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getReceiptById, getReceiptsByDate } from '@/lib/receipts';
import { ReceiptsWithStudents } from '@/types';

import DataTable from '../ui/data-table/data-table';
import { columns } from './columns';
import ReceiptDialog from './receipt-dialog';

interface ReceiptsTableProps {
    receiptListPromise: ReturnType<typeof getReceiptsByDate>;
    receiptDetailPromise: ReturnType<typeof getReceiptById>;
}

export default function ReceiptsTable({ receiptListPromise, receiptDetailPromise }: ReceiptsTableProps) {
    const { data, totalPages } = React.use(receiptListPromise);
    const receipt = React.use(receiptDetailPromise);

    const table = useURLManagedDataTable<ReceiptsWithStudents>({
        data,
        columns,
        pageCount: totalPages
    });

    return (
        <>
            <DataTable table={table} columns={columns} />
            <ReceiptDialog receipt={receipt} />
        </>
    );
}
