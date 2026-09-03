'use client';

import { DownloadIcon } from 'lucide-react';
import React from 'react';

import BulkDebtorStatusDialog from '@/components/debtors/bulk-debtor-status-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getExpiredInvoiceList, getExpiredInvoicesData } from '@/lib/invoices';
import { convertAndExportToXlsx, formatCurrency } from '@/lib/utils';
import { InvoiceListItem } from '@/types';

import { getColumns } from './columns';

type InvoicesTableTableProps = {
  invoicesPromise: ReturnType<typeof getExpiredInvoiceList>;
  expiredInvoicesDataPromise: ReturnType<typeof getExpiredInvoicesData>;
  canManageDebtors: boolean;
};

export default function InvoicesTable({
  invoicesPromise,
  expiredInvoicesDataPromise,
  canManageDebtors
}: InvoicesTableTableProps) {
  const { data, totalPages, totalExpiredAmount } = React.use(invoicesPromise);
  const sheetData = React.use(expiredInvoicesDataPromise);

  function handleDownload() {
    convertAndExportToXlsx(sheetData, 'Vencimientos');
  }

  const columns = React.useMemo(() => getColumns(canManageDebtors), [canManageDebtors]);

  const table = useURLManagedDataTable<InvoiceListItem>({
    data,
    columns,
    pageCount: totalPages
  });

  return (
    <>
      <div className='flex justify-between mb-4'>
        <div className='flex gap-1 items-center '>
          <h3 className='text-sm font-medium'>Deuda total: </h3>
          {totalExpiredAmount && <Badge variant='outline'>{formatCurrency(totalExpiredAmount)}</Badge>}
        </div>
        <div className='flex gap-2'>
          {canManageDebtors && <BulkDebtorStatusDialog table={table} mode='mark' />}
          <Button variant='outline' onClick={handleDownload}>
            <DownloadIcon width={15} height={15} className='mr-2' />
            Exportar
          </Button>
        </div>
      </div>
      <DataTable table={table} columns={columns} withRowSelection={canManageDebtors} />
    </>
  );
}
