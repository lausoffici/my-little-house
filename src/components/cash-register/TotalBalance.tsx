'use client';

import React from 'react';

import { getExpendituresByDate, getIncomingsListByDate } from '@/lib/cash-register';
import { formatCurrency } from '@/lib/utils';

import { Badge } from '../ui/badge';

type TotalBalanceProps = {
    incomingsPromise: ReturnType<typeof getIncomingsListByDate>;
    outcomingsPromise: ReturnType<typeof getExpendituresByDate>;
    initialBalance: number;
};

export default function TotalBalance({ incomingsPromise, outcomingsPromise, initialBalance }: TotalBalanceProps) {
    const incomings = React.use(incomingsPromise);
    const outcomings = React.use(outcomingsPromise);

    const totalBalance = incomings.totalAmount - outcomings.totalAmount + initialBalance;

    return (
        <div className='flex items-center'>
            <h2 className='text-xl font-bold mr-2'>Debe haber</h2>
            <Badge variant='outline' className='text-foreground w-fit text-sm'>
                {formatCurrency(totalBalance)}
            </Badge>
        </div>
    );
}
