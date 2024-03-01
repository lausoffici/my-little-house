'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { courseFormSchema } from '@/lib/validations/form';

interface CourseFormProps {
  onFormSubmit: (course: FormData) => void;
  defaultValues: {
    name: string;
    amount: number;
    observations: string;
  };
}

export const FORM_ID = 'course-form';

export default function CourseForm({ onFormSubmit, defaultValues }: CourseFormProps) {
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues
  });

  function onSubmit(course: FormData) {
    onFormSubmit(course);
  }

  return (
    <Form {...form}>
      <form action={onSubmit} className='space-y-2 py-3' id={FORM_ID}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder='Ej. Intermediate' autoComplete='off' {...field} />
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
                <Input type='number' placeholder='12.000' autoComplete='off' {...field} />
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
