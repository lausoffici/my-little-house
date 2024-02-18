'use client';

import { Course } from '@prisma/client';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SetStateAction } from 'react';

import CourseForm, { FORM_ID } from '@/components/courses/course-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { editCourse } from '@/lib/courses';

interface EditCourseDialogProps {
    course: Course;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function EditCourseDialog({ course, onOpenChange }: EditCourseDialogProps) {
    const { toast } = useToast();
    const { name, amount, observations, id } = course;
    const router = useRouter();

    const currentValue = {
        name,
        amount,
        observations: observations ?? ''
    };

    async function handleSubmit(editedCourse: FormData) {
        toast({
            description: `Curso editado exitosamente: ${editedCourse.get('name')} `,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        await editCourse(id, editedCourse);
        onOpenChange(false);
        router.refresh();
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
