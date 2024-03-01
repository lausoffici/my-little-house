'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { addExpenditure } from '@/lib/cash-register';

export const FORM_ID = 'add-outcoming-form';

const initialState = {
  message: '',
  error: false
};

type AddOutcomingForm = {
  onOpenDialogChange: (open: boolean) => void;
};

export function AddOutcomingForm({ onOpenDialogChange }: AddOutcomingForm) {
  const router = useRouter();
  const [state, action] = useFormState(addExpenditure, initialState);
  const { toast } = useToast();

  const form = useForm({
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
    onOpenDialogChange(false);
  }, [onOpenDialogChange, router, state, toast]);

  return (
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
      </form>
    </Form>
  );
}
