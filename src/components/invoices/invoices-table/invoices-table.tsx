'use client';

import { DownloadIcon } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getExpiredInvoiceList, getExpiredInvoicesData } from '@/lib/invoices';
import { convertAndExportToXlsx, formatCurrency } from '@/lib/utils';
import { InvoiceListItem } from '@/types';

import { columns } from './columns';

type InvoicesTableTableProps = {
  invoicesPromise: ReturnType<typeof getExpiredInvoiceList>;
};

export default function InvoicesTable({ invoicesPromise }: InvoicesTableTableProps) {
  const { data, totalPages, totalExpiredAmount } = React.use(invoicesPromise);

  async function handleDownload() {
    const data = await getExpiredInvoicesData();
    convertAndExportToXlsx(data);
  }

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
        <div>
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
