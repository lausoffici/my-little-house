import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

import DebtorsTable from '@/components/debtors/debtors-table/debtors-table';
import { authOptions, dashboardAllowedEmails } from '@/lib/auth';
import { getDebtorInvoiceList, getDebtorInvoicesData } from '@/lib/debtors';
import { PageProps } from '@/types';

export default async function DebtorsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail || !dashboardAllowedEmails.includes(userEmail)) {
    notFound();
  }

  const debtorInvoicesPromise = getDebtorInvoiceList(searchParams);
  const debtorInvoicesDataPromise = getDebtorInvoicesData(searchParams);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Deudores</h1>
          <p className='text-gray-600 text-sm mt-2'>Estudiantes marcados como deudores y sus cuotas pendientes.</p>
        </div>
      </div>
      <React.Suspense fallback='Cargando...'>
        <DebtorsTable invoicesPromise={debtorInvoicesPromise} debtorInvoicesDataPromise={debtorInvoicesDataPromise} />
      </React.Suspense>
    </div>
  );
}
