'use client';

import { Enrollment } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addEnrollmentInvoice } from '@/lib/invoices';
import { formatCurrency } from '@/lib/utils';

import { toast } from '../ui/use-toast';

interface AddEnrollmentDialogProps {
  enrollmentsPromise: Promise<Enrollment[]>;
  studentId: string;
}

export function AddEnrollmentInvoiceToStudentDialog({ enrollmentsPromise, studentId }: AddEnrollmentDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const enrollments = use(enrollmentsPromise);

  const [state, action] = useFormState(addEnrollmentInvoice, undefined);

  useEffect(() => {
    if (state?.error) {
      toast({ title: 'Error', description: state.message, variant: 'destructive' });
    } else if (state?.message) {
      toast({ title: 'Éxito', description: state.message, variant: 'success' });
      router.refresh();
    }
    setIsOpen(false);
  }, [state, router]);

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button type='submit' disabled={pending}>
        {pending ? 'Agregando...' : 'Confirmar'}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Agregar matrícula
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar matrícula</DialogTitle>
          <DialogDescription>
            Selecciona una matrícula por año para agregar a la ficha del estudiante.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <input type='hidden' name='studentId' value={studentId} />
          <Select name='enrollmentId' required>
            <SelectTrigger className='mb-4'>
              <SelectValue placeholder='Selecciona una matrícula' />
            </SelectTrigger>
            <SelectContent>
              {enrollments.map((enrollment) => (
                <SelectItem key={enrollment.id} value={enrollment.id.toString()}>
                  Matrícula {enrollment.year} - {formatCurrency(enrollment.amount)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)} type='button'>
              Cancelar
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
