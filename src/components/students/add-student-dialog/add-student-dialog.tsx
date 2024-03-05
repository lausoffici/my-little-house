'use client';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

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
import { createStudent } from '@/lib/students';

import StudentForm, { STUDENT_FORM_ID } from '../student-form';

export default function AddStudentDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircledIcon /> <span className='ml-2'>Crear estudiante</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Nuevo estudiante</DialogTitle>
          <DialogDescription>Complete el formulario para crear un nuevo estudiante</DialogDescription>
        </DialogHeader>
        <StudentForm onOpenDialogChange={setIsOpen} action={createStudent} />
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button form={STUDENT_FORM_ID} type='submit'>
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
