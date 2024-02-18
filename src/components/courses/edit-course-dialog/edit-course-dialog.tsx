'use client';

import { Course } from '@prisma/client';
import { CheckIcon } from '@radix-ui/react-icons';
import { SetStateAction } from 'react';

import CourseForm, { FORM_ID } from '@/components/courses/course-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface EditCourseDialogProps {
    course: Course;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function EditCourseDialog({ course, onOpenChange }: EditCourseDialogProps) {
    const { toast } = useToast();
    const { name, amount, observations } = course;

    const currentValue = {
        course: name,
        price: amount,
        observations
    };

    function handleSubmit(newCourseName: string) {
        toast({
            description: `Curso editado exitosamente: ${newCourseName} `,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        onOpenChange(false);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Curso</DialogTitle>
                <DialogDescription>Modifique el formulario para editar el curso</DialogDescription>
            </DialogHeader>
            <CourseForm onFormSubmit={handleSubmit} defaultValues={currentValue} />
            <DialogFooter>
                <Button variant='outline' onClick={() => onOpenChange(false)}>
                    Cancelar
                </Button>
                <Button form={FORM_ID} type='submit'>
                    Guardar
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
