'use client';

import { CashRegisterInitialBalance } from '@prisma/client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

import { AddInitialBalanceForm } from '../add-initial-balance-form';

export const FORM_ID = 'add-initial-balance-form';

type AddInitialBalanceDialogProps = {
    initialBalance: CashRegisterInitialBalance | null;
};

export function AddInitialBalanceDialog({ initialBalance }: AddInitialBalanceDialogProps) {
    const [openStudentDialog, setOpenStudentDialog] = useState(false);

    return (
        <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
            <DialogTrigger asChild>
                <Button>
                    <span className='ml-2'>{initialBalance ? 'Modificar' : 'Agregar'} saldo inicial</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Saldo inicial</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para {initialBalance ? 'modificar' : 'agregar'} el saldo inicial de la
                        caja
                    </DialogDescription>
                </DialogHeader>
                <AddInitialBalanceForm initialBalance={initialBalance} onOpenDialogChange={setOpenStudentDialog} />
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenStudentDialog(false)}>
                        Cancelar
                    </Button>
                    <Button form={FORM_ID} type='submit'>
                        Agregar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
