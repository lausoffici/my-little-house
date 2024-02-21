'use client';

import { CashRegisterInitialBalance } from '@prisma/client';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { setCashRegisterBalance } from '@/lib/cash-register';

import { FORM_ID } from './add-initial-balance-dialog';

const initialState = {
    message: '',
    error: false
};

type AddInitialBalanceFormProps = {
    onOpenDialogChange: (open: boolean) => void;
    initialBalance: CashRegisterInitialBalance | null;
};

export function AddInitialBalanceForm({ onOpenDialogChange, initialBalance }: AddInitialBalanceFormProps) {
    const { toast } = useToast();
    const [state, action] = useFormState(setCashRegisterBalance, initialState);
    const router = useRouter();
    const searchParams = useSearchParams();

    const day = Number(searchParams.get('day')) || new Date().getDate();
    const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = Number(searchParams.get('year')) || new Date().getFullYear();

    const date = new Date(year, month - 1, day);

    useEffect(() => {
        if (state === undefined || state.message === '') return;

        if (state?.error) {
            toast({
                description: state?.message,
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
