'use client';

import { Enrollment } from '@prisma/client';
import { SetStateAction } from 'react';

import EnrollmentForm, { ENROLLMENT_FORM_ID } from '@/components/enrollment/enrollment-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { editEnrollment } from '@/lib/enrollment';

interface EditEnrollmentDialog {
  enrollment: Enrollment;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
}

export default function EditEnrollmentDialog({ enrollment, onOpenChange }: EditEnrollmentDialog) {
  const defaultValues = { year: enrollment.year.toString(), amount: enrollment.amount.toString() };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Matrícula </DialogTitle>
        <DialogDescription>Modifique el formulario para editar la matrícula {enrollment.year}</DialogDescription>
      </DialogHeader>
      <EnrollmentForm
        action={editEnrollment}
        onOpenDialogChange={onOpenChange}
        defaultValues={defaultValues}
        id={enrollment.id}
        isEdition
      />
      <DialogFooter>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button form={ENROLLMENT_FORM_ID} type='submit'>
          Guardar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
