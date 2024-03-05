'use client';

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
import { getEnrollments } from '@/lib/enrollment';

import EnrollmentForm, { ENROLLMENT_FORM_ID } from './enrollment-form';
import EnrollmentTable from './enrollment-table';

interface EnrollmentDialogProps {
  createdEnrollmentsPromise: ReturnType<typeof getEnrollments>;
}

export default function EnrollmentDialog({ createdEnrollmentsPromise }: EnrollmentDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='secondary'>Crear Matrícula</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva matrícula</DialogTitle>
          <DialogDescription>Complete el formulario para crear una nueva matrícula</DialogDescription>
        </DialogHeader>
        <EnrollmentTable createdEnrollmentsPromise={createdEnrollmentsPromise} />
        <EnrollmentForm onOpenDialogChange={setOpenDialog} />
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
