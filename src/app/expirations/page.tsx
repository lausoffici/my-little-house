import React from 'react';

import InvoicesTable from '@/components/invoices/invoices-table/invoices-table';
import { getExpiredInvoiceList } from '@/lib/invoices';
import { SearchParams } from '@/types';

export interface ExpirationsPageProps {
    searchParams: SearchParams;
}

export default async function ExpirationsPage({ searchParams }: ExpirationsPageProps) {
    const expiredInvoicesPromise = getExpiredInvoiceList(searchParams);

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>Vencimientos</h1>
                    <p className='text-gray-600 text-sm mt-2'>Consulta de cuotas impagas y vencidas.</p>
                </div>
            </div>
            <React.Suspense fallback='Cargando...'>
                <InvoicesTable invoicesPromise={expiredInvoicesPromise} />
            </React.Suspense>
        </div>
    );
}
