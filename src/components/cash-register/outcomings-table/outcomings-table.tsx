'use client';

import { Expenditure } from '@prisma/client';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import { getExpendituresByDate } from '@/lib/cash-register';
import { formatCurrency, isToday } from '@/lib/utils';
import { getAppliedDateFromSearchParams } from '@/lib/utils/cash-register.utils';

import { AddOutcomingDialog } from '../add-outcoming-dialog';
import { columns } from './columns';

type OutcomingsTableProps = {
  outcomingsPromise: ReturnType<typeof getExpendituresByDate>;
};

export default function OutcomingsTable({ outcomingsPromise }: OutcomingsTableProps) {
  const searchParams = useSearchParams();
  const { data, totalAmount } = React.use(outcomingsPromise);

  const table = useReactTable<Expenditure>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: false
  });

  const date = getAppliedDateFromSearchParams(searchParams);
  const appliedDateIsToday = isToday(date);

  return (
    <>
      <div className='flex mb-2 justify-between items-center'>
        <div className='flex items-center min-h-[32px]'>
          <h2 className='text-xl font-bold mr-2'>Salidas:</h2>
          <Badge variant='outline' className='text-sm mr-1'>
            {formatCurrency(totalAmount)}
          </Badge>
        </div>
        {appliedDateIsToday && <AddOutcomingDialog />}
      </div>

      <DataTable table={table} columns={columns} withRowSelection={false} />
    </>
  );
}
