'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Textarea } from '../ui/textarea';

const formSchema = z.object({
    course: z
        .string({
            required_error: 'El nombre del curso es requerido'
        })
        .min(3, { message: 'El título debe tener al menos 3 caracteres' })
        .max(50),
    price: z.coerce
        .number({ required_error: 'El precio del curso es requerido' })
        .positive({ message: 'El precio debe ser mayor a 0' }),
    description: z.string()
});

interface CourseFormProps {
    onFormSubmit: (value: string) => void;
    defaultValues: {
        course: string;
        price: number;
        description: string;
    };
}

export const FORM_ID = 'course-form';

export default function CourseForm({ onFormSubmit, defaultValues }: CourseFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        onFormSubmit(values.course);
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 py-3' id={FORM_ID}>
                <FormField
                    control={form.control}
                    name='course'
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
                    name='price'
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
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Ej. Lunes y Miércoles 16hs' autoComplete='off' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
