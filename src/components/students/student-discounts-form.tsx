'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { addDiscount, getStudentById } from '@/lib/students';
import { discountsFormSchema } from '@/lib/validations/form';

const initialState = {
  message: '',
  error: false,
  receipt: null
};

export const DICOUNTS_FORM_ID = 'invoice-form';

const DISCOUNTS_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '10%', value: 0.1 },
  { label: '15%', value: 0.15 },
  { label: '20%', value: 0.2 },
  { label: '30%', value: 0.3 },
  { label: '40%', value: 0.4 },
  { label: '50%', value: 0.5 },
  { label: '100%', value: 1 }
];

interface ChargeInvoicesFormProps {
  studentByCourse: NonNullable<Awaited<ReturnType<typeof getStudentById>>>['studentByCourse'];
}

export default function StudentDiscountsForm({ studentByCourse }: ChargeInvoicesFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [state, action] = useFormState(addDiscount, initialState);
  const { id: studentId } = useParams<{ id: string }>();

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
  }, [router, state, toast]);

  const form = useForm<z.infer<typeof discountsFormSchema>>({
    resolver: zodResolver(discountsFormSchema)
  });

  const courseOptions = studentByCourse.map(({ course: { id, name } }) => {
    return {
      label: name,
      value: id
    };
  });

  const selectedStudentByCourseId = studentByCourse.find(
    ({ course }) => course.id === Number(form.getValues('course'))
  )?.id;

  return (
    <Form {...form}>
      <form className='space-y-3 py-3' action={action} id={DICOUNTS_FORM_ID}>
        <FormField
          control={form.control}
          name='course'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select onValueChange={field.onChange} {...field}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cursos</SelectLabel>
                    {courseOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='discount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descuento</FormLabel>
              <Select onValueChange={field.onChange} {...field}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Descuentos</SelectLabel>
                    {DISCOUNTS_OPTIONS.map(({ label, value }) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type='hidden' name='studentId' value={studentId} />
        <input type='hidden' name='studentByCourseId' value={selectedStudentByCourseId} />
      </form>
    </Form>
  );
}
