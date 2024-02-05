'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import { SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { ICourse } from '@/types';

import CourseForm, { FORM_ID } from '../CourseForm';

interface EditCourseDialogProps {
    course: ICourse;
    setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
}

export default function EditCourseDialog({ course, setOpenDialog }: EditCourseDialogProps) {
    const { toast } = useToast();
    const { name, amount, description } = course;

    const currentValue = {
        course: name,
        price: amount,
        description
    };

    function handleSubmit(newCourseName: string) {
        toast({
            description: `Curso editado exitosamente: ${newCourseName} `,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        setOpenDialog(false);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Curso</DialogTitle>
                <DialogDescription>Modifique el formulario para editar el curso</DialogDescription>
            </DialogHeader>
            <CourseForm onFormSubmit={(newCourseName) => handleSubmit(newCourseName)} defaultValues={currentValue} />
            <DialogFooter>
                <Button variant='outline' onClick={() => setOpenDialog(false)}>
                    Cancelar
                </Button>
                <Button form={FORM_ID} type='submit'>
                    Guardar
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
