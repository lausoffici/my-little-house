import { CashRegisterInitialBalance } from '@prisma/client';
import React from 'react';

import TotalBalance from '@/components/cash-register/TotalBalance';
import { AddInitialBalanceDialog } from '@/components/cash-register/add-initial-balance-dialog';
import CashRegisterDatePicker from '@/components/cash-register/cash-register-date-picker';
import IncomingsTable from '@/components/cash-register/incomings-table';
import OutcomingsTable from '@/components/cash-register/outcomings-table';
import { Badge } from '@/components/ui/badge';
import { getCashRegisterBalance, getExpendituresByDate, getIncomingsListByDate } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';
import { SearchParams } from '@/types';

export interface CashRegisterProps {
    searchParams: SearchParams;
}

export default async function CashRegister({ searchParams }: CashRegisterProps) {
    const incomingsPromise = getIncomingsListByDate(searchParams);
    const outcomingsPromise = getExpendituresByDate(searchParams);

    const initialBalance: CashRegisterInitialBalance | null = await getCashRegisterBalance(searchParams);

    return (
        <section>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-3'>
                    <h1 className='text-3xl font-bold text-foreground'>Caja</h1>
                    <div className='w-[160px]'>
                        <CashRegisterDatePicker />
                    </div>
                </div>
                <AddInitialBalanceDialog initialBalance={initialBalance} />
            </div>

            {initialBalance ? (
                <div className='flex items-center text-xl font-bold mb-6'>
                    <h2 className='mr-2'>Saldo inicial</h2>
                    <Badge variant='outline' className='text-sm'>
                        {formatCurrency(initialBalance?.balance ?? 0)}
                    </Badge>
                </div>
            ) : (
                <div className='flex items-center text-xl font-bold mb-6'>
                    <h2 className='mr-2'>Saldo inicial</h2>
                    <Badge variant='outline' className='text-sm'>
                        --
                    </Badge>
                </div>
            )}

            <div className='flex gap-2 w-full flex-col 2xl:flex-row'>
                <div className='flex-auto'>
                    <React.Suspense fallback={'Cargando Entradas...'}>
                        <IncomingsTable incomingsPromise={incomingsPromise} />
                    </React.Suspense>
                </div>
                <div className='flex-initial'>
                    <React.Suspense fallback={'Cargando Salidas...'}>
                        <OutcomingsTable outcomingsPromise={outcomingsPromise} />
                    </React.Suspense>
                </div>
            </div>

            <TotalBalance
                outcomingsPromise={outcomingsPromise}
                incomingsPromise={incomingsPromise}
                initialBalance={initialBalance?.balance ?? 0}
            />
        </section>
    );
}
