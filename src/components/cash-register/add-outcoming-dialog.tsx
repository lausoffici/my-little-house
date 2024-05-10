'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addExpenditure } from '@/lib/cash-register';

import { SubmitButton } from '../submit-button';
import { useToast } from '../ui/use-toast';

const initialState = {
  message: '',
  error: false
};
const FORM_ID = 'add-outcoming-form';

export function AddOutcomingDialog() {
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [state, action] = useFormState(addExpenditure, initialState);

  const outcomingSchema = z.object({
    description: z.string(),
    amount: z.number()
  });

  const form = useForm<z.infer<typeof outcomingSchema>>({
    resolver: zodResolver(outcomingSchema),
    defaultValues: {
      description: '',
      amount: 0
    }
  });

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
    setOpenStudentDialog(false);
  }, [router, state, toast]);

  return (
    <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='px-2'>
          Agregar salida
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar salida</DialogTitle>
          <DialogDescription>Complete el formulario para agregar una salida de dinero a la caja</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={action} className='space-y-2 py-3' id={FORM_ID}>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Concepto</FormLabel>
                  <FormControl>
                    <Input required placeholder='Retiro' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Importe ($)</FormLabel>
                  <FormControl>
                    <Input required type='number' placeholder='100' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpenStudentDialog(false)}>
                Cancelar
              </Button>
              <SubmitButton formId={FORM_ID} title='Agregar' />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
