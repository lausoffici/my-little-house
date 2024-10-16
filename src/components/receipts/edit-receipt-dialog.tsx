'use client';

import { ReceiptPaymentMethod } from '@prisma/client';
import React from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateReceipt } from '@/lib/receipts';
import { ReceiptWithStudent } from '@/types';

import { SubmitButton } from '../submit-button';
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
    }
    onClose();
  }, [onClose, state]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Recibo</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <input type='hidden' name='id' value={receipt.id} />
          <div className='py-4'>
            <label htmlFor='paymentMethod' className='block text-sm font-medium text-gray-700'>
              Método de Pago
            </label>
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
