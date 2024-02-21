'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteStudent } from '@/lib/students';
import { StudentWithCourses } from '@/types';

interface DeleteCourseDialogProps {
    studentWithCourses: StudentWithCourses;
}

export default function DeleteStudentDialog({ studentWithCourses }: DeleteCourseDialogProps) {
    const [openDeleteStudentDialog, setopenDeleteStudentDialog] = useState(false);
    const { toast } = useToast();
    const { firstName, lastName, id } = studentWithCourses;
    const router = useRouter();

    const fullName = `${firstName} ${lastName}`;

    async function handleDelete() {
        toast({
            description: `Estudiante eliminado: ${fullName} `,
            icon: <TrashIcon width='20px' height='20px' />,
            variant: 'destructive'
        });
        await deleteStudent(id);
        setopenDeleteStudentDialog(false);
        router.replace('/students');
    }

    return (
        <Dialog open={openDeleteStudentDialog} onOpenChange={setopenDeleteStudentDialog}>
            <DialogTrigger asChild>
                <Button variant='destructive' className='p-2'>
                    <TrashIcon className='mr-2' /> Eliminar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                </DialogHeader>
                <div className='my-3'>
                    ¿Desea eliminar a <span className='font-semibold'>{fullName}</span> definitivamente?
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setopenDeleteStudentDialog(false)}>
                        Cancelar
                    </Button>
                    <Button variant='destructive' type='button' onClick={handleDelete}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
