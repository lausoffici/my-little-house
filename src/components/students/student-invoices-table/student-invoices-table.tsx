'use client';

import { Invoice } from '@prisma/client';
import React from 'react';

import DataTable from '@/components/ui/data-table/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getStudentInvoices } from '@/lib/students';

import { columns } from './columns';

type StudentInvoicesTableProps = {
  invoicesPromise: ReturnType<typeof getStudentInvoices>;
};

export default function StudentInvoicesTable({ invoicesPromise }: StudentInvoicesTableProps) {
  const { invoices, totalPages } = React.use(invoicesPromise);

  const table = useURLManagedDataTable<Invoice>({
    data: invoices,
    columns,
    pageCount: totalPages
  });

  return <DataTable table={table} columns={columns} withRowSelection={false} />;
}
