import React from 'react';

import CashRegisterDatePicker from '@/components/cash-register/cash-register-date-picker';
import IncomingsTable from '@/components/cash-register/incomings-table';
import InitialBalance from '@/components/cash-register/initial-balance';
import OutcomingsTable from '@/components/cash-register/outcomings-table';
import TotalBalance from '@/components/cash-register/total-balance';
import { getCashRegisterBalance, getExpendituresByDate, getIncomingsListByDate } from '@/lib/cash-register';
import { SearchParams } from '@/types';

export interface CashRegisterProps {
    searchParams: SearchParams;
}

export default async function CashRegister({ searchParams }: CashRegisterProps) {
    const incomingsPromise = getIncomingsListByDate(searchParams);
    const outcomingsPromise = getExpendituresByDate(searchParams);
    const initialBalancePromise = getCashRegisterBalance(searchParams);

    return (
        <section>
            <div className='flex justify-between mb-6'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>Caja</h1>
                    <p className='text-gray-600 text-sm mt-2'>
                        Consulta de entradas y salidas de dinero en efectivo por fecha.
                    </p>
                </div>
                <div className='max-w-[160px]'>
                    <CashRegisterDatePicker />
                </div>
            </div>
            <React.Suspense fallback='Cargando saldo inicial...'>
                <InitialBalance initialBalancePromise={initialBalancePromise} />
            </React.Suspense>
            <div className='flex gap-2 w-full flex-col 2xl:flex-row'>
                <div className='flex-auto'>
                    <React.Suspense fallback='Cargando Entradas...'>
                        <IncomingsTable incomingsPromise={incomingsPromise} />
                    </React.Suspense>
                </div>
                <div className='flex-initial'>
                    <React.Suspense fallback='Cargando Salidas...'>
                        <OutcomingsTable outcomingsPromise={outcomingsPromise} />
                    </React.Suspense>
                </div>
            </div>
            <React.Suspense fallback='Cargando saldo final...'>
                <TotalBalance
                    outcomingsPromise={outcomingsPromise}
                    incomingsPromise={incomingsPromise}
                    initialBalancePromise={initialBalancePromise}
                />
            </React.Suspense>
        </section>
    );
}
