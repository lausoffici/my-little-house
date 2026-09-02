'use client';

import { DownloadIcon } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getDebtorInvoiceList, getDebtorInvoicesData } from '@/lib/debtors';
import { convertAndExportToXlsx, formatCurrency } from '@/lib/utils';
import { DebtorInvoiceListItem } from '@/types';

import { columns } from './columns';
import DebtorsTableFilters from './debtors-table-filters';

type DebtorsTableProps = {
  invoicesPromise: ReturnType<typeof getDebtorInvoiceList>;
  debtorInvoicesDataPromise: ReturnType<typeof getDebtorInvoicesData>;
};

export default function DebtorsTable({ invoicesPromise, debtorInvoicesDataPromise }: DebtorsTableProps) {
  const { data, totalPages, totalDebtAmount } = React.use(invoicesPromise);
  const sheetData = React.use(debtorInvoicesDataPromise);

  function handleDownload() {
    convertAndExportToXlsx(sheetData, 'Deudores');
  }

  const table = useURLManagedDataTable<DebtorInvoiceListItem>({
    data,
    columns,
    pageCount: totalPages
  });

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex gap-1 items-center '>
          <h3 className='text-sm font-medium'>Deuda total: </h3>
          {totalDebtAmount && <Badge variant='outline'>{formatCurrency(totalDebtAmount)}</Badge>}
        </div>
        <div className='flex items-center gap-2'>
          <DebtorsTableFilters />
          <Button variant='outline' onClick={handleDownload}>
            <DownloadIcon width={15} height={15} className='mr-2' />
            Exportar
          </Button>
        </div>
      </div>
      <DataTable table={table} columns={columns} withRowSelection={false} />
    </>
  );
}
