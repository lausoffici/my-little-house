'use client';

import { ExclamationTriangleIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/components/ui/use-toast';
import { createCourse } from '@/lib/courses';

const defaultValues = {
  name: '',
  amount: 0,
  observations: ''
};

export default function AddCourseDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(newCourse: FormData) {
    try {
      await createCourse(newCourse);

      toast({
        description: `Curso creado exitosamente: ${newCourse.get('name')}`,
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });

      setOpenDialog(false);
      router.refresh();
    } catch (err) {
      toast({
        description: `Ha ocurrido un error`,
        icon: <ExclamationTriangleIcon width='20px' height='20px' />,
        variant: 'destructive'
      });
      console.log(err);
    }
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
