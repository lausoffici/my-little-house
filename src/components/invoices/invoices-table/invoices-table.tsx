'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getExpiredInvoiceList } from '@/lib/invoices';
import { formatCurrency } from '@/lib/utils';
import { InvoiceListItem } from '@/types';

import { columns } from './columns';

type InvoicesTableTableProps = {
    invoicesPromise: ReturnType<typeof getExpiredInvoiceList>;
};

export default function InvoicesTable({ invoicesPromise }: InvoicesTableTableProps) {
    const { data, totalPages, totalExpiredAmount } = React.use(invoicesPromise);

    const table = useURLManagedDataTable<InvoiceListItem>({
        data,
        columns,
        pageCount: totalPages
    });

    return (
        <>
            <div className='flex gap-1 items-center mb-4'>
                <h3 className='text-sm font-medium'>Deuda total: </h3>
                {totalExpiredAmount && <Badge variant='outline'>{formatCurrency(totalExpiredAmount)}</Badge>}
            </div>
            <DataTable table={table} columns={columns} />
        </>
    );
}
