'use client';

import { Pencil1Icon } from '@radix-ui/react-icons';
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
import { editStudent } from '@/lib/students';
import { StudentWithCourses } from '@/types';

import StudentForm, { STUDENT_FORM_ID } from '../student-form';

type EditStudentDialogProps = {
  student: StudentWithCourses;
};

export default function EditStudentDialog({ student }: EditStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues = {
    firstName: student.firstName,
    lastName: student.lastName,
    birthDate: student.birthDate || undefined,
    dni: student.dni || undefined,
    address: student.address || undefined,
    city: student.city || undefined,
    phone: student.phone || undefined,
    mobilePhone: student.mobilePhone || undefined,
    momPhone: student.momPhone || undefined,
    dadPhone: student.dadPhone || undefined,
    observations: student.observations || undefined,
    id: student.id
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' title='Editar' style={{ marginTop: 0 }}>
          <Pencil1Icon className='mr-2' /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Editar estudiante</DialogTitle>
          <DialogDescription>Modifique el formulario para editar la información del estudiante</DialogDescription>
        </DialogHeader>
        <StudentForm action={editStudent} defaultValues={defaultValues} onOpenDialogChange={setIsOpen} />
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button form={STUDENT_FORM_ID} type='submit'>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
