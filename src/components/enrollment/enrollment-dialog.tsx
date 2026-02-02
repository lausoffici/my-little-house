'use client';

import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import React from 'react';

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
import { addEnrollment } from '@/lib/enrollment';

import EnrollmentForm, { ENROLLMENT_FORM_ID } from './enrollment-form';

export default function EnrollmentDialog() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircledIcon /> <span className='ml-2'>Crear Matrícula</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva matrícula</DialogTitle>
          <DialogDescription>Complete el formulario para crear una nueva matrícula</DialogDescription>
        </DialogHeader>
        <EnrollmentForm onOpenDialogChange={setOpenDialog} action={addEnrollment} />
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button form={ENROLLMENT_FORM_ID} type='submit'>
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
