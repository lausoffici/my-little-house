'use client';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import CourseForm, { FORM_ID } from '@/components/CourseForm';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const defaultValues = {
    course: '',
    price: 0,
    description: ''
};

export default function AddCourseDialog() {
    const [openDialog, setOpenDialog] = useState(false);
    const { toast } = useToast();

    function handleSubmit(newCourseName: string) {
        toast({
            description: `Curso creado exitosamente: ${newCourseName}`,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        setOpenDialog(false);
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircledIcon /> <span className='ml-2'>Crear Curso</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Curso</DialogTitle>
                    <DialogDescription>Complete el formulario para crear un nuevo curso</DialogDescription>
                </DialogHeader>
                <CourseForm onFormSubmit={handleSubmit} defaultValues={defaultValues} />
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button form={FORM_ID} type='submit'>
                        Crear
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
