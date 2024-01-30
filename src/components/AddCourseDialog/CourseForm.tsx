'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { CheckIcon } from '@radix-ui/react-icons';
import { z } from 'zod';

interface InputFieldProps {
    name: 'course' | 'price' | 'description';
    label: string;
    getInput: (
        field: ControllerRenderProps<{
            description: string;
            course: string;
            price: string;
        }>
    ) => ReactNode;
}

const inputFields: InputFieldProps[] = [
    {
        name: 'course',
        label: 'Título',
        getInput: (field) => <Input placeholder='Ej. Intermediate' autoComplete='off' {...field} />
    },
    {
        name: 'price',
        label: 'Precio',
        getInput: (field) => <Input type='number' placeholder='12.000' className='pl-6' autoComplete='off' {...field} />
    },
    {
        name: 'description',
        label: 'Descripción',
        getInput: (field) => <Textarea placeholder='Ej. Lunes y Miércoles 16hs' autoComplete='off' {...field} />
    }
];

export default function CourseForm({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
    const { toast } = useToast();

    const formSchema = z.object({
        course: z
            .string({
                required_error: 'El nombre del curso es requerido'
            })
            .min(3, { message: 'El título debe tener al menos 3 caracteres' })
            .max(50),
        price: z
            .string({ required_error: 'El precio del curso es requerido' })
            .min(2, { message: 'El precio debe tener al menos 3 caracteres' }),
        description: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            course: '',
            description: '',
            price: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            description: 'Curso creado exitosamente',
            icon: <CheckIcon width='20px' height='20px' />
        });
        setOpen(false);
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                {inputFields.map(({ name, label, getInput }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem className={name === 'price' ? 'mt-3 relative' : ''}>
                                <FormLabel className='text-brand-black-100'>{label}</FormLabel>
                                <FormControl>{getInput(field)}</FormControl>
                                {name === 'price' ? (
                                    <span className='text-gray-400 absolute left-3 top-[30px] '>$</span>
                                ) : null}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <div className='w-full flex justify-between items-center mt-4'>
                    <Button type='submit'>Crear</Button>
                    <Button
                        type='button'
                        variant='outline'
                        className='text-brand-black-100'
                        onClick={() => setOpen(false)}
                    >
                        Descartar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
