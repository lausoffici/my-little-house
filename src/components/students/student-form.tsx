'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getDatePickerFormattedDate } from '@/lib/utils';
import { studentFormSchema } from '@/lib/validations/form';

import { DateTimePicker } from '../ui/date-picker/date-picker';
import { useToast } from '../ui/use-toast';

type StudentFormValues = {
  firstName: string;
  lastName: string;
  birthDate?: Date;
  dni?: string;
  address?: string;
  city?: string;
  phone?: string;
  mobilePhone?: string;
  momPhone?: string;
  dadPhone?: string;
  observations?: string;
  id?: number;
};

interface StudentFormProps {
  defaultValues?: StudentFormValues;
  onOpenDialogChange: (open: boolean) => void;
  action: (
    _: any,
    formData: FormData
  ) => Promise<{
    error?: boolean;
    message: string;
    id?: number;
  }>;
}

export const STUDENT_FORM_ID = 'student-form';

const emptyDefaultValues = {
  firstName: '',
  lastName: '',
  birthDate: undefined,
  dni: '',
  address: '',
  city: '',
  phone: '',
  mobilePhone: '',
  momPhone: '',
  dadPhone: '',
  observations: ''
};

const initialState = {
  message: '',
  error: false,
  id: undefined
};

export default function StudentForm({
  defaultValues = emptyDefaultValues,
  onOpenDialogChange,
  action: serverAction
}: StudentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, action] = useFormState(serverAction, initialState);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
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
      if (state.id) router.push(`/students/${state.id}`);
      router.refresh();
    }
    onOpenDialogChange(false);
  }, [onOpenDialogChange, router, state, toast]);

  return (
    <Form {...form}>
      <form action={action} id={STUDENT_FORM_ID} className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Nombre</FormLabel>
              <FormControl>
                <Input required placeholder='Monica' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Apellido</FormLabel>
              <FormControl>
                <Input required placeholder='Geller' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='birthDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <DateTimePicker defaultValue={field.value ? getDatePickerFormattedDate(field.value) : undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dni'
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input type='number' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder='Av. Rios 1562' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localidad</FormLabel>
              <FormControl>
                <Input placeholder='Llavallol' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder='4444-4444' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='mobilePhone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder='1512345678' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='momPhone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular Madre/tutora</FormLabel>
              <FormControl>
                <Input placeholder='1512345678' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dadPhone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular Padre/tutor</FormLabel>
              <FormControl>
                <Input placeholder='1512345678' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='observations'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea placeholder='Nombre madre/padre y/o tutor ' autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type='hidden' name='id' value={defaultValues?.id} />
      </form>
    </Form>
  );
}
