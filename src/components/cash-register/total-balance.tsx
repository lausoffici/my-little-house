'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { getCashRegisterBalance, getExpendituresByDate, getIncomingsListByDate } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';

type TotalBalanceProps = {
    incomingsPromise: ReturnType<typeof getIncomingsListByDate>;
    outcomingsPromise: ReturnType<typeof getExpendituresByDate>;
    initialBalancePromise: ReturnType<typeof getCashRegisterBalance>;
};

export default function TotalBalance({
    incomingsPromise,
    outcomingsPromise,
    initialBalancePromise
}: TotalBalanceProps) {
    const incomings = React.use(incomingsPromise);
    const outcomings = React.use(outcomingsPromise);
    const initialBalance = React.use(initialBalancePromise);

    const initialBalanceAmount = initialBalance?.balance ?? 0;

    const totalBalance = incomings.totalAmount - outcomings.totalAmount + initialBalanceAmount;

    return (
        <div className='flex items-center'>
            <h2 className='text-xl font-bold mr-2'>Saldo total:</h2>
            <Badge variant='outline' className='text-foreground w-fit text-sm'>
                {formatCurrency(totalBalance)}
            </Badge>
        </div>
    );
}
