'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Invoice } from '@prisma/client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { updateAmount } from '@/lib/invoices';
import { editInvoiceFormSchema } from '@/lib/validations/form';

interface EditInvoiceDialogProps {
  invoice: Invoice;
}

const initialState = {
  message: '',
  error: false
};

const EDIT_INVOICE_FORM_ID = 'edit-invoice-form';

export default function EditInvoiceDialog({ invoice }: EditInvoiceDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const [state, action] = useFormState(updateAmount, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof editInvoiceFormSchema>>({
    resolver: zodResolver(editInvoiceFormSchema),
    defaultValues: {
      amount: invoice.amount.toString()
    }
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
    setOpenDialog(false);
  }, [router, state, toast]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className='w-full'>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Editar Importe</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cuota</DialogTitle>
        </DialogHeader>
        <div className='my-3 '>
          Complete el formulario para editar el importe de la cuota
          <div className='font-semibold'>
            {invoice.description} {invoice.year}
          </div>
        </div>
        <Form {...form}>
          <form action={action} id={EDIT_INVOICE_FORM_ID}>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe ($)</FormLabel>
                  <FormControl>
                    <Input type='number' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type='hidden' name='invoiceId' value={invoice.id} />
          </form>
        </Form>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button type='submit' form={EDIT_INVOICE_FORM_ID}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
