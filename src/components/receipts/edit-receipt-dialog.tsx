'use client';

import { ReceiptPaymentMethod } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateReceipt } from '@/lib/receipts';
import { ReceiptWithStudent } from '@/types';

import { SubmitButton } from '../submit-button';
import { Label } from '../ui/label';
import { toast } from '../ui/use-toast';

interface EditReceiptDialogProps {
  receipt: ReceiptWithStudent;
  onClose: () => void;
}

const initialState = {
  message: '',
  error: false,
  receipt: null
};

export default function EditReceiptDialog({ receipt, onClose }: EditReceiptDialogProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = React.useState(receipt.paymentMethod);

  const [state, action] = useFormState(updateReceipt, initialState);

  React.useEffect(() => {
    if (state === undefined || state.message === '') return;

    if (state.error) {
      toast({
        title: 'Error',
        description: state?.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Éxito',
        description: state?.message,
        variant: 'success'
      });
      router.refresh();
    }
    onClose();
  }, [onClose, router, state]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Recibo</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <input type='hidden' name='id' value={receipt.id} />
          <div className='py-4 mb-2'>
            <Label htmlFor='paymentMethod'>Método de Pago</Label>
            <Select
              name='paymentMethod'
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as ReceiptPaymentMethod)}
            >
              <SelectTrigger id='paymentMethod' className='w-full mt-1'>
                <SelectValue placeholder='Seleccionar método de pago' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CASH'>Efectivo</SelectItem>
                <SelectItem value='TRANSFER'>Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancelar
            </Button>
            <SubmitButton title='Guardar' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
