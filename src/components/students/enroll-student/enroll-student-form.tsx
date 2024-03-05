'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
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
import { enrollCourse, getCourseOptions } from '@/lib/courses';
import { formatPercentage } from '@/lib/utils';
import { enrollStudentFormSchema } from '@/lib/validations/form';

import { DISCOUNTS } from '../student-discounts-form';

interface StudentFormProps {
  onOpenDialogChange: Dispatch<SetStateAction<boolean>>;
  courseOptionsPromise: ReturnType<typeof getCourseOptions>;
  enrolledCourses: Course[];
}

export const ENROLL_STUDENT_FORM_ID = 'student-form';

const initialState = {
  message: '',
  error: false
};

export default function EnrollStudentForm({
  onOpenDialogChange,
  courseOptionsPromise,
  enrolledCourses
}: StudentFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [state, action] = useFormState(enrollCourse, initialState);
  const { id: studentId } = useParams<{ id: string }>();
  const coursesOptions = React.use(courseOptionsPromise);

  const availableCoursesOptions = coursesOptions.filter(
    (course) => !enrolledCourses.map(({ id }) => id).includes(Number(course.value))
  );

  const form = useForm<z.infer<typeof enrollStudentFormSchema>>({
    resolver: zodResolver(enrollStudentFormSchema)
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
      onOpenDialogChange(false);
    }
  }, [onOpenDialogChange, router, state, toast]);

  return (
    <Form {...form}>
      <form action={action} id={ENROLL_STUDENT_FORM_ID} className='space-y-3 py-3'>
        <FormField
          control={form.control}
          name='course'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select onValueChange={field.onChange} required {...field}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cursos</SelectLabel>
                    {availableCoursesOptions.map(({ value, label }) => (
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
                    {DISCOUNTS.map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {formatPercentage(value)}
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
      </form>
    </Form>
  );
}
