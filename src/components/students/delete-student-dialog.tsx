'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiMoon } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteStudent, inactivateStudent } from '@/lib/students';
import { StudentWithCourses } from '@/types';

interface DeleteCourseDialogProps {
  studentWithCourses: StudentWithCourses;
  isInactivation?: boolean;
  buttonTrigger: JSX.Element;
}

export default function DeleteStudentDialog({
  studentWithCourses,
  isInactivation = false,
  buttonTrigger
}: DeleteCourseDialogProps) {
  const [openDeleteStudentDialog, setOpenDeleteStudentDialog] = useState(false);
  const { toast } = useToast();
  const { firstName, lastName, id } = studentWithCourses;
  const router = useRouter();

  const fullName = `${firstName} ${lastName}`;

  async function handleDelete() {
    try {
      if (isInactivation) await inactivateStudent(id);
      else await deleteStudent(id);

      toast({
        description: `Estudiante ${isInactivation ? 'inactivo' : 'eliminado'}: ${fullName} `,
        icon: isInactivation ? <FiMoon width='20px' height='20px' /> : <TrashIcon width='20px' height='20px' />,
        variant: isInactivation ? 'default' : 'destructive'
      });

      setOpenDeleteStudentDialog(false);
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
    <Dialog open={openDeleteStudentDialog} onOpenChange={setOpenDeleteStudentDialog}>
      <DialogTrigger asChild>{buttonTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar {isInactivation ? 'Inactivación' : 'Eliminación'}</DialogTitle>
        </DialogHeader>
        <div className='my-3'>
          ¿Desea {isInactivation ? 'Inactivar' : 'Eliminar permanentemente'} a{' '}
          <b className='font-semibold'>{fullName}</b> ?
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDeleteStudentDialog(false)}>
            Cancelar
          </Button>
          <Button variant='destructive' type='button' onClick={handleDelete}>
            {isInactivation ? 'Inactivar' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
