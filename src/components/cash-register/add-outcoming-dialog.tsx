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

import { AddInitialBalanceForm } from './add-initial-balance-form';

export const FORM_ID = 'add-outcoming-form';

type AddOutcomingDialogProps = {
    initialBalance: CashRegisterInitialBalance | null;
};

export function AddOutcomingDialog({ initialBalance }: AddOutcomingDialogProps) {
    const [openStudentDialog, setOpenStudentDialog] = useState(false);

    return (
        <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='sm'>
                    {initialBalance ? 'Modificar' : 'Agregar'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Salida</DialogTitle>
                    <DialogDescription>Complete el formulario para agregar una salida de dinero</DialogDescription>
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
