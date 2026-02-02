'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getReceiptWithItemsById, getReceiptsByDate } from '@/lib/receipts';
import { ReceiptWithStudent } from '@/types';

import { columns } from './columns';
import { EditReceiptDialog } from './edit-receipt-dialog';
import ReceiptDialog from './receipt-dialog';

interface ReceiptsTableProps {
  receiptListPromise: ReturnType<typeof getReceiptsByDate>;
  receiptDetailPromise: ReturnType<typeof getReceiptWithItemsById>;
}

export default function ReceiptsTable({ receiptListPromise, receiptDetailPromise }: ReceiptsTableProps) {
  const { data, totalPages } = React.use(receiptListPromise);
  const receipt = React.use(receiptDetailPromise);

  const [editingReceipt, setEditingReceipt] = React.useState<ReceiptWithStudent | null>(null);

  const actionsColumn = {
    id: 'actions',
    cell: ({ row }: { row: Row<ReceiptWithStudent> }) => {
      const receipt = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setEditingReceipt(receipt)}>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  };

  const tableColumns = [...columns, actionsColumn];

  const table = useURLManagedDataTable<ReceiptWithStudent>({
    data,
    columns: tableColumns,
    pageCount: totalPages
  });

  return (
    <>
      <DataTable table={table} columns={tableColumns} withRowSelection={false} />
      {receipt && <ReceiptDialog receipt={receipt} />}
      {editingReceipt && <EditReceiptDialog receipt={editingReceipt} onClose={() => setEditingReceipt(null)} />}
    </>
  );
}
