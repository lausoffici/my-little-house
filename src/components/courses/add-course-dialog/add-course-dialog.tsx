'use client';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import CourseForm, { FORM_ID } from '@/components/courses/course-form';
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
import { createCourse } from '@/lib/courses';

const defaultValues = {
  name: '',
  amount: undefined,
  observations: ''
};

export default function AddCourseDialog() {
  const [openDialog, setOpenDialog] = useState(false);

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
        <CourseForm action={createCourse} defaultValues={defaultValues} onOpenDialogChange={setOpenDialog} />
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
