'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReceiptPaymentMethod } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateReceipt } from '@/lib/receipts';
import { editReceiptFormSchema } from '@/lib/validations/form';
import { ReceiptWithStudent } from '@/types';

import { SubmitButton } from '../submit-button';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';

interface EditReceiptDialogProps {
  receipt: ReceiptWithStudent;
  onClose: () => void;
}

const initialState = {
  message: '',
  error: false,
  receipt: null
};

export function EditReceiptDialog({ receipt, onClose }: EditReceiptDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const receiptId = receipt.id.toString();

  const {
    control,
    formState: { errors }
  } = useForm<z.infer<typeof editReceiptFormSchema>>({
    resolver: zodResolver(editReceiptFormSchema),
    defaultValues: {
      id: receiptId,
      paymentMethod: receipt.paymentMethod
    }
  });

  const [state, formAction] = useFormState(updateReceipt, initialState);

  useEffect(() => {
    if (state.message === '') return;

    if (state.error) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Éxito',
        description: state.message,
        variant: 'success'
      });
      router.refresh();
      onClose();
    }
  }, [state, toast, router, onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Recibo</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <input type='hidden' name='id' value={receiptId} />
          <div className='py-4 mb-2'>
            <Label htmlFor='paymentMethod'>Método de Pago</Label>
            <Controller
              name='paymentMethod'
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger id='paymentMethod' className='w-full mt-1'>
                    <SelectValue placeholder='Seleccionar método de pago' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReceiptPaymentMethod.CASH}>Efectivo</SelectItem>
                    <SelectItem value={ReceiptPaymentMethod.TRANSFER}>Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && <p className='text-red-500 text-sm mt-1'>{errors.paymentMethod.message}</p>}
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
