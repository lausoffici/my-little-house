import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

import DashboardKpis from '@/components/dashboard/dashboard-kpis';
import DatePickerWithURLParams from '@/components/ui/date-picker/date-picker-with-url-params';
import { authOptions, dashboardAllowedEmails } from '@/lib/auth';
import { getDashboard } from '@/lib/dashboards';
import { getReceiptsBalancePerYear } from '@/lib/receipts';
import { PageProps } from '@/types';

export default async function Dashboard({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail || !dashboardAllowedEmails.includes(userEmail)) {
    notFound();
  }
  const dashboardPromise = getDashboard(searchParams);
  const receiptsPromise = getReceiptsBalancePerYear(searchParams);

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
