import React from 'react';

import DashboardKpis from '@/components/dashboard/dashboard-kpis';
import DatePickerWithURLParams from '@/components/ui/date-picker/date-picker-with-url-params';
import { getDashboard } from '@/lib/dashboards';
import { getAllCurrentYearReceipts } from '@/lib/receipts';
import { PageProps } from '@/types';

export default function Dashboard({ searchParams }: PageProps) {
  const dashboardPromise = getDashboard(searchParams);
  const receiptsPromise = getAllCurrentYearReceipts(searchParams);

  return (
    <section>
      <div className='flex justify-between mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Resumen</h1>
        <div className='w-full max-w-[160px]'>
          <DatePickerWithURLParams />
        </div>
      </div>
      <React.Suspense fallback='Cargando...'>
        <DashboardKpis dashboardPromise={dashboardPromise} receiptsPromise={receiptsPromise} />
      </React.Suspense>
    </section>
  );
}
