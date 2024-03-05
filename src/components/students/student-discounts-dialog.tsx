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
import { getStudentById } from '@/lib/students';

import StudentDiscountsForm, { DICOUNTS_FORM_ID } from './student-discounts-form';

interface ChargeInvoicesDialogProps {
  studentByCourse: NonNullable<Awaited<ReturnType<typeof getStudentById>>>['studentByCourse'];
}

export default function DiscountsFormDialog({ studentByCourse }: ChargeInvoicesDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Agregar descuento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar descuento</DialogTitle>
          <DialogDescription>Seleccione el curso y el porcentaje de descuento.</DialogDescription>
        </DialogHeader>
        <React.Suspense fallback='Cargando...'>
          <StudentDiscountsForm studentByCourse={studentByCourse} onOpenDialogChange={setOpenDialog} />
        </React.Suspense>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button form={DICOUNTS_FORM_ID} type='submit'>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
