'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { getCashRegisterBalance } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';

import { AddInitialBalanceDialog } from './add-initial-balance-dialog';

type InitialBalanceProps = {
    initialBalancePromise: ReturnType<typeof getCashRegisterBalance>;
};

export default function InitialBalance({ initialBalancePromise }: InitialBalanceProps) {
    const initialBalance = React.use(initialBalancePromise);

    return initialBalance ? (
        <div className='flex items-center text-xl font-bold mb-6'>
            <h2 className='mr-2'>Saldo inicial:</h2>
            <Badge variant='outline' className='text-sm mr-1'>
                {formatCurrency(initialBalance?.balance ?? 0)}
            </Badge>
            <AddInitialBalanceDialog initialBalance={initialBalance} />
        </div>
    ) : (
        <div className='flex items-center text-xl font-bold mb-6'>
            <h2 className='mr-2'>Saldo inicial:</h2>
            <Badge variant='outline' className='text-sm mr-1'>
                --
            </Badge>
            <AddInitialBalanceDialog initialBalance={initialBalance} />
        </div>
    );
}
