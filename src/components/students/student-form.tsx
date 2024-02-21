'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { getDatePickerFormattedDate } from '@/lib/utils';
import { studentFormSchema } from '@/lib/validations/form';
import { Option } from '@/types';

import { DateTimePicker } from '../ui/date-picker/date-picker';

type StudentFormValues = {
    firstName: string;
    lastName: string;
    courses?: string[];
    birthDate?: Date;
    dni?: string;
    address?: string;
    city?: string;
    phone?: string;
    mobilePhone?: string;
    momPhone?: string;
    dadPhone?: string;
    observations?: string;
};
interface StudentFormProps {
    onFormSubmit: (value: any) => void;
    defaultValues?: StudentFormValues;
    courseOptions: Option[];
}

export const STUDENT_FORM_ID = 'student-form';

const emptyDefaultValues = {
    firstName: '',
    lastName: '',
    courses: [],
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

export default function StudentForm({
    onFormSubmit,
    defaultValues = emptyDefaultValues,
    courseOptions
}: StudentFormProps) {
    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentFormSchema),
        defaultValues
    });

    function onSubmit(values: FormData) {
        onFormSubmit(values);
    }

    return (
        <Form {...form}>
            <form action={onSubmit} id={STUDENT_FORM_ID} className='grid grid-cols-2 gap-4'>
                <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Nombre
                            </FormLabel>
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
                            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                Apellido
                            </FormLabel>
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
                                <DateTimePicker
                                    defaultValue={field.value ? getDatePickerFormattedDate(field.value) : undefined}
                                />
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
                    name='courses'
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel>Cursos</FormLabel>
                            <MultiSelect
                                options={courseOptions}
                                selected={field.value && field.value.length > 0 ? field.value : []}
                                className='w-[622px]'
                                notFoundMessage='Curso no encontrado'
                                {...field}
                                name='courses'
                            />
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
            </form>
        </Form>
    );
}
