'use client';

import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { markStudentAsDebtor, unmarkStudentAsDebtor } from '@/lib/debtors';
import { StudentWithCourses } from '@/types';

import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface DebtorStatusDialogProps {
  studentWithCourses: StudentWithCourses;
}

export default function DebtorStatusDialog({ studentWithCourses }: DebtorStatusDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { firstName, lastName, id, isDebtor } = studentWithCourses;
  const router = useRouter();

  const fullName = `${firstName} ${lastName}`;

  async function handleToggle() {
    try {
      if (isDebtor) await unmarkStudentAsDebtor(id);
      else await markStudentAsDebtor(id);

      toast({
        description: isDebtor
          ? `Estudiante quitado de deudores: ${fullName}`
          : `Estudiante marcado como deudor: ${fullName}`,
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
      console.error(err);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          {isDebtor ? 'Quitar de Deudores' : 'Marcar como Deudor'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar {isDebtor ? 'Quitar de Deudores' : 'Marcar como Deudor'}</DialogTitle>
        </DialogHeader>
        <div className='my-3'>
          {isDebtor ? (
            <>
              ¿Desea quitar a <b className='font-semibold'>{fullName}</b> de la lista de deudores? Sus cuotas vencidas
              impagas volverán a aparecer en Vencimientos.
            </>
          ) : (
            <>
              ¿Desea marcar a <b className='font-semibold'>{fullName}</b> como deudor? Sus cuotas impagas dejarán de
              aparecer en Vencimientos y se listarán en Deudores hasta que se le cobre alguna cuota.
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button type='button' onClick={handleToggle}>
            {isDebtor ? 'Quitar de Deudores' : 'Marcar como Deudor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
