'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { coursesOptions } from '@/lib/variables';

const studentFormSchema = z.object({
    firstName: z
        .string({
            required_error: 'El nombre es requerido'
        })
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        .max(50),
    lastName: z
        .string({
            required_error: 'El apellido es requerido'
        })
        .min(3, { message: 'El apellido debe tener al menos 3 caracteres' })
        .max(50),
    courses: z.optional(z.array(z.string())),
    description: z.optional(z.string()),
    address: z.optional(z.string()),
    email: z.string(),
    _id: z.string()
});

interface StudentFormProps {
    onFormSubmit: (value: any) => void;
    defaultValues?: any;
}

export const STUDENT_FORM_ID = 'student-form';

const emptyDefaultValues = {
    firstName: '',
    lastName: '',
    courses: [],
    description: '',
    address: '',
    email: '',
    id: ''
};

export default function StudentForm({ onFormSubmit, defaultValues = emptyDefaultValues }: StudentFormProps) {
    const form = useForm<z.infer<typeof studentFormSchema>>({
        resolver: zodResolver(studentFormSchema),
        defaultValues
    });

    function onSubmit(values: z.infer<typeof studentFormSchema>) {
        onFormSubmit(values);
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 py-3' id={STUDENT_FORM_ID}>
                <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder='Monica' autoComplete='off' {...field} />
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
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                                <Input placeholder='Geller' autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='courses'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cursos</FormLabel>
                            <MultiSelect
                                options={coursesOptions}
                                selected={field.value ? field.value : []}
                                className='w-[453px]'
                                notFoundMessage='Curso no encontrado'
                                {...field}
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
                                <Input placeholder='Av. Rios 1562, Monte Grande' autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='monica.geller@gmail.com'
                                    type='email'
                                    autoComplete='off'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Nombre y teléfonos' autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
