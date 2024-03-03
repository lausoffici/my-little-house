'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { scholarshipInvoice } from '@/lib/invoices';
import { scholarshipFormSchema } from '@/lib/validations/form';

interface ScholarshipInvoiceDialogProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  invoiceFullDescription: string;
  invoiceId: number;
}

const initialState = {
  message: '',
  error: false
};

const SCHOLARSHIP_FORM_ID = 'scholarship-form';

export function ScholarshipInvoiceDialog({
  onOpenChange,
  invoiceFullDescription,
  invoiceId
}: ScholarshipInvoiceDialogProps) {
  const [state, action] = useFormState(scholarshipInvoice, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof scholarshipFormSchema>>({
    resolver: zodResolver(scholarshipFormSchema)
  });

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
    onOpenChange(false);
  }, [onOpenChange, router, state, toast]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar Beca</DialogTitle>
      </DialogHeader>
      <div className='my-3'>
        ¿Desea becar <span className='font-semibold'>{invoiceFullDescription}</span>?
      </div>
      <Form {...form}>
        <form action={action} id={SCHOLARSHIP_FORM_ID}>
          <input type='hidden' name='invoiceId' value={invoiceId} />
        </form>
      </Form>
      <DialogFooter>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type='submit' form={SCHOLARSHIP_FORM_ID}>
          Becar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
