'use client';

import React from 'react';

import { useSearchParams } from '@/hooks/use-search-params';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getReceiptsByDate } from '@/lib/receipts';
import { ReceiptItems, ReceiptsWithStudents } from '@/types';

import DataTable from '../ui/data-table/data-table';
import { columns } from './columns';
import ReceiptDialog from './receipt-dialog';

interface ReceiptsTableProps {
    receiptsPromise: ReturnType<typeof getReceiptsByDate>;
    receiptItemsPromise: Promise<ReceiptItems>;
}

export default function ReceiptsTable({ receiptsPromise, receiptItemsPromise }: ReceiptsTableProps) {
    const { data, totalPages } = React.use(receiptsPromise);
    const receiptItems = React.use(receiptItemsPromise);
    const { searchParams } = useSearchParams();

    const table = useURLManagedDataTable<ReceiptsWithStudents>({
        data,
        columns,
        pageCount: totalPages
    });

    const receipt = data.find(({ id }) => id === Number(searchParams.get('receiptId')));

    return (
        <>
            <DataTable table={table} columns={columns} />
            {receipt && <ReceiptDialog receipt={receipt} key={receipt.id} items={receiptItems} />}
        </>
    );
}
