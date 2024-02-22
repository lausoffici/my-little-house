'use client';

import { CashRegisterInitialBalance } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { setCashRegisterBalance } from '@/lib/cash-register';
import { getAppliedDateFromSearchParams } from '@/lib/utils/cash-register.utils';

const initialState = {
    message: '',
    error: false
};

type AddInitialBalanceFormProps = {
    onOpenDialogChange: (open: boolean) => void;
    initialBalance: CashRegisterInitialBalance | null;
};

export const FORM_ID = 'add-initial-balance-form';

export function AddInitialBalanceForm({ onOpenDialogChange, initialBalance }: AddInitialBalanceFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [state, action] = useFormState(setCashRegisterBalance, initialState);
    const { toast } = useToast();

    const date = getAppliedDateFromSearchParams(searchParams);

    useEffect(() => {
        if (state === undefined || state.message === '') return;

        if (state?.error) {
            toast({
                description: state?.message,
                icon: <ExclamationTriangleIcon width='20px' height='20px' />,
                variant: 'destructive'
            });
        } else {
            toast({
                description: state?.message,
                icon: <CheckIcon width='20px' height='20px' />,
                variant: 'success'
            });
            router.refresh();
        }
        onOpenDialogChange(false);
    }, [onOpenDialogChange, router, state, toast]);

    return (
        <form action={action} className='space-y-2 py-3' id={FORM_ID}>
            <Label htmlFor='balance'>Saldo inicial ($)</Label>
            <Input type='number' name='balance' defaultValue={initialBalance?.balance} />
            <input type='hidden' name='date' value={date.toISOString()} />
            <input type='hidden' name='id' value={initialBalance?.id} />
        </form>
    );
}
