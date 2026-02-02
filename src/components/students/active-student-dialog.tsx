'use client';

import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { activateStudent } from '@/lib/students';
import { StudentWithCourses } from '@/types';

import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface ActivateStudentDialogProps {
  studentWithCourses: StudentWithCourses;
}

export default function ActivateStudentDialog({ studentWithCourses }: ActivateStudentDialogProps) {
  const [openActivateStudentDialog, setOpenActivateStudentDialog] = useState(false);
  const { toast } = useToast();
  const { firstName, lastName, id } = studentWithCourses;
  const router = useRouter();

  const fullName = `${firstName} ${lastName}`;

  async function handleActivation() {
    try {
      await activateStudent(id);

      toast({
        description: `Estudiante Activado: ${fullName} `,
        icon: <CheckIcon width='20px' height='20px' />,
        variant: 'success'
      });

      setOpenActivateStudentDialog(false);
      router.replace('/students');
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
    <Dialog open={openActivateStudentDialog} onOpenChange={setOpenActivateStudentDialog}>
      <DialogTrigger asChild>
        <Button variant='ghost' className='p-0 w-full'>
          Activar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Activación</DialogTitle>
        </DialogHeader>
        <div className='my-3'>
          ¿Desea Activar a <b className='font-semibold'>{fullName}</b> ?
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenActivateStudentDialog(false)}>
            Cancelar
          </Button>
          <Button type='button' onClick={handleActivation}>
            Activar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
