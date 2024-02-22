import { CashRegisterInitialBalance } from '@prisma/client';
import React from 'react';

import { AddInitialBalanceDialog } from '@/components/cash-register/add-initial-balance-dialog';
import CashRegisterDatePicker from '@/components/cash-register/cash-register-date-picker/cash-register-date-picker';
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
    const initialBalance: CashRegisterInitialBalance | null = await getCashRegisterBalance(searchParams);

    return (
        <section>
            <div className='flex justify-between mb-6'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground mb-1'>Caja</h1>
                    <p className='text-gray-600 text-sm'>
                        Consulta de entradas y salidas de dinero en efectivo por fecha.
                    </p>
                </div>

                <div className='w-[160px]'>
                    <CashRegisterDatePicker />
                </div>
                <AddInitialBalanceDialog initialBalance={initialBalance} />
            </div>

            {initialBalance ? (
                <div className='flex text-xl font-bold mb-6'>
                    <h2 className='mr-2'>Saldo inicial</h2>
                    <Badge variant='outline' className='w-fit text-sm'>
                        {formatCurrency(initialBalance?.balance ?? 0)}
                    </Badge>
                </div>
            ) : (
                <div className='flex items-center text-xl font-bold mb-6'>
                    <h2 className='mr-2'>Saldo inicial</h2>
                    <Badge variant='outline' className='font-medium text-sm'>
                        --
                    </Badge>
                </div>
            )}

            <div className='flex flex-col'>
                <React.Suspense fallback={'Loading...'}>
                    <IncomingsTable incomingsPromise={incomingsPromise} />
                </React.Suspense>

                <div>
                    <h2 className='text-xl font-bold text-foreground mb-2'>Salidas</h2>
                </div>
            </div>
        </section>
    );
}
