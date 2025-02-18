'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { enrollmentFormSchema } from '@/lib/validations/form';

import { useToast } from '../ui/use-toast';

interface EnrollmentFormProps {
  defaultValues?: { year: string; amount: string };
  onOpenDialogChange: (open: boolean) => void;
  action: (
    _: any,
    formData: FormData
  ) => Promise<{
    error?: boolean;
    message: string;
  }>;
  id?: number;
  isEdition?: boolean;
}

const initialState = {
  message: '',
  error: false
};

export const ENROLLMENT_FORM_ID = 'enrollment-form';
export default function EnrollmentForm({
  defaultValues,
  onOpenDialogChange,
  action: serverAction,
  id,
  isEdition = false
}: EnrollmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, action] = useFormState(serverAction, initialState);

  const form = useForm<z.infer<typeof enrollmentFormSchema>>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues
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
    onOpenDialogChange(false);
  }, [onOpenDialogChange, router, state, toast]);

  return (
    <Form {...form}>
      <form action={action} id={ENROLLMENT_FORM_ID} className='grid grid-cols-2 gap-4'>
        {!isEdition && (
          <FormField
            control={form.control}
            name='year'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Ciclo Lectivo</FormLabel>
                <FormControl>
                  <Input type='number' required autoComplete='off' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Precio</FormLabel>
              <FormControl>
                <Input type='number' required autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type='hidden' className='hidden' name='id' value={id?.toString()} />
      </form>
    </Form>
  );
}
