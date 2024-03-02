'use client';

import React from 'react';

import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getReceiptWithItemsById, getReceiptsByDate } from '@/lib/receipts';
import { ReceiptWithStudent } from '@/types';

import { columns } from './columns';
import ReceiptDialog from './receipt-dialog';

interface ReceiptsTableProps {
  receiptListPromise: ReturnType<typeof getReceiptsByDate>;
  receiptDetailPromise: ReturnType<typeof getReceiptWithItemsById>;
}

export default function ReceiptsTable({ receiptListPromise, receiptDetailPromise }: ReceiptsTableProps) {
  const { data, totalPages } = React.use(receiptListPromise);
  const receipt = React.use(receiptDetailPromise);

  const table = useURLManagedDataTable<ReceiptWithStudent>({
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
