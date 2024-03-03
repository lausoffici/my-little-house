'use client';

import { useState } from 'react';
import React from 'react';

import { getUnpaidInvoicesByStudent } from '@/lib/invoices';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import ChargeInvoicesForm, { CHARGE_INVOICE_FORM_ID } from './charge-invoices-form';

interface ChargeInvoicesDialogProps {
  unpaidInvoicesPromise: ReturnType<typeof getUnpaidInvoicesByStudent>;
}

export default function ChargeInvoicesDialog({ unpaidInvoicesPromise }: ChargeInvoicesDialogProps) {
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  return (
    <Dialog open={openInvoiceDialog} onOpenChange={setOpenInvoiceDialog}>
      <DialogTrigger asChild>
        <Button size='sm'>Cobrar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar cuota</DialogTitle>
          <DialogDescription>Seleccione el monto a cobrar</DialogDescription>
        </DialogHeader>
        <React.Suspense fallback='Cargando...'>
          <ChargeInvoicesForm unpaidInvoicesPromise={unpaidInvoicesPromise} />
        </React.Suspense>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenInvoiceDialog(false)}>
            Cancelar
          </Button>
          <Button form={CHARGE_INVOICE_FORM_ID} type='submit'>
            Cobrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
