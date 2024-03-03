import React from 'react';

import ReceiptsTable from '@/components/receipts/receipts-table';
import DatePickerWithURLParams from '@/components/ui/date-picker/date-picker-with-url-params';
import { getReceiptWithItemsById, getReceiptsByDate } from '@/lib/receipts';
import { PageProps } from '@/types';

export default function Receipts({ searchParams }: PageProps) {
  const receiptListPromise = getReceiptsByDate(searchParams);
  const receiptDetailPromise = getReceiptWithItemsById(searchParams);

  return (
    <section>
      <div className='flex justify-between mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Comprobantes</h1>
        <div className='w-full max-w-[160px]'>
          <DatePickerWithURLParams />
        </div>
      </div>
      <React.Suspense fallback='Cargando...'>
        <ReceiptsTable receiptListPromise={receiptListPromise} receiptDetailPromise={receiptDetailPromise} />
      </React.Suspense>
    </section>
  );
}
