import { CashRegisterInitialBalance } from '@prisma/client';
import React from 'react';

import { AddInitialBalanceDialog } from '@/components/cash-register/add-initial-balance-dialog';
import IncomingsTable from '@/components/cash-register/incomings-table/incomings-table';
import { Badge } from '@/components/ui/badge';
import { getCashRegisterBalance, getIncomingsList } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';
import { SearchParams } from '@/types';

export interface CashRegisterProps {
    searchParams: SearchParams;
}

export default async function CashRegister({ searchParams }: CashRegisterProps) {
    const incomingsPromise = getIncomingsList(searchParams);
    const initialBalance: CashRegisterInitialBalance | null = await getCashRegisterBalance(new Date().toString());

    return (
        <section>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-foreground'>Caja</h1>
                <AddInitialBalanceDialog initialBalance={initialBalance} />
            </div>

            {initialBalance && (
                <div className='flex text-xl font-bold mb-6'>
                    <h2 className='mr-2'>Saldo inicial</h2>
                    <Badge variant='outline' className='text-foreground w-fit text-sm'>
                        {formatCurrency(initialBalance.balance)}
                    </Badge>
                </div>
            )}

            <div className='flex flex-col'>
                <div>
                    <h2 className='text-xl font-bold text-foreground mb-2'>Entradas</h2>
                    <React.Suspense fallback={'Loading...'}>
                        <IncomingsTable incomingsPromise={incomingsPromise} />
                    </React.Suspense>
                </div>
                <div>
                    <h2 className='text-xl font-bold text-foreground mb-2'>Salidas</h2>
                </div>
            </div>
        </section>
    );
}
