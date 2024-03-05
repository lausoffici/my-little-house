'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
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
import { deleteCourseEnrollment } from '@/lib/courses';
import { getStudentById } from '@/lib/students';
import { deleteCourseEnrollmentSchema } from '@/lib/validations/form';

interface EnrollmentFormProps {
  onOpenDialogChange: (open: boolean) => void;
  enrolledCourses: Course[];
  studentByCourse: NonNullable<Awaited<ReturnType<typeof getStudentById>>>['studentByCourse'];
}

export const DELETE_ENROLLMENT_FORM_ID = 'enrollment-form';

const initialState = {
  message: '',
  error: false
};

export default function EnrollmentForm({ onOpenDialogChange, enrolledCourses, studentByCourse }: EnrollmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, action] = useFormState(deleteCourseEnrollment, initialState);
  const { id: studentId } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof deleteCourseEnrollmentSchema>>({
    resolver: zodResolver(deleteCourseEnrollmentSchema)
  });

  const enrolledCoursesOptions = enrolledCourses.map((course) => ({
    value: String(course.id),
    label: course.name
  }));

  const selectedStudentByCourseId = studentByCourse.find(
    ({ course }) => course.id === Number(form.getValues('courseId'))
  )?.id;

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
      <form action={action} id={DELETE_ENROLLMENT_FORM_ID}>
        <FormField
          control={form.control}
          name='courseId'
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
                    {enrolledCoursesOptions.map(({ value, label }) => (
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
