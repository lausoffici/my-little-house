'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { courseFormSchema } from '@/lib/validations/form';

interface CourseFormProps {
  defaultValues: {
    name: string;
    amount?: number;
    observations: string;
  };
  onOpenDialogChange: Dispatch<SetStateAction<boolean>>;
  action: (
    _: any,
    formData: FormData
  ) => Promise<{
    error?: boolean;
    message: string;
  }>;
}

const initialState = {
  message: '',
  error: false
};

export const FORM_ID = 'course-form';

export default function CourseForm({ defaultValues, onOpenDialogChange, action: serverAction }: CourseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, action] = useFormState(serverAction, initialState);

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
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
      <form action={action} className='space-y-2 py-3' id={FORM_ID}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder='Ej. Intermediate' required autoComplete='off' {...field} />
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
              <FormLabel>Precio ($)</FormLabel>
              <FormControl>
                <Input type='number' required placeholder='12.000' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='observations'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Ej. Lunes y Miércoles 16hs'
                  autoComplete='off'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
