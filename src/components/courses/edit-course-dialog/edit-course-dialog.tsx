'use client';

import { Course } from '@prisma/client';
import { SetStateAction } from 'react';

import CourseForm, { FORM_ID } from '@/components/courses/course-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { editCourse } from '@/lib/courses';

interface EditCourseDialogProps {
  course: Course;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function EditCourseDialog({ course, onOpenChange }: EditCourseDialogProps) {
  const { name, amount, observations, id } = course;

  const currentValue = {
    name,
    amount,
    observations: observations ?? ''
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Curso</DialogTitle>
        <DialogDescription>Modifique el formulario para editar el curso</DialogDescription>
      </DialogHeader>
      <CourseForm action={editCourse} defaultValues={currentValue} onOpenDialogChange={onOpenChange} id={id} />
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
