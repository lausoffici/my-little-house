'use client';

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

import { AddOutcomingForm, FORM_ID } from './add-outcoming-form';

export function AddOutcomingDialog() {
  const [openStudentDialog, setOpenStudentDialog] = useState(false);

  return (
    <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='px-2'>
          Agregar salida
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar salida</DialogTitle>
          <DialogDescription>Complete el formulario para agregar una salida de dinero a la caja</DialogDescription>
        </DialogHeader>
        <AddOutcomingForm onOpenDialogChange={setOpenStudentDialog} />
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenStudentDialog(false)}>
            Cancelar
          </Button>
          <Button form={FORM_ID} type='submit'>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
