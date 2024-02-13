'use client';

import { Pencil1Icon } from '@radix-ui/react-icons';
import { CheckIcon } from '@radix-ui/react-icons';
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
import { useToast } from '@/components/ui/use-toast';
import { IStudent } from '@/types';

import StudentForm, { STUDENT_FORM_ID } from '../student-form';

export default function EditStudentDialog({ student }: { student: IStudent }) {
    const [openEditStudentDialog, setOpenEditStudentDialog] = useState(false);
    const { toast } = useToast();

    function handleSubmit(newStudent: IStudent) {
        toast({
            description: `Estudiante editado: ${newStudent.firstName} ${newStudent.lastName}`,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        setOpenEditStudentDialog(false);
    }

    return (
        <Dialog open={openEditStudentDialog} onOpenChange={setOpenEditStudentDialog}>
            <DialogTrigger asChild>
                <Button variant='outline' size='sm' title='Editar' style={{ marginTop: 0 }}>
                    <Pencil1Icon className='mr-2' /> Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar estudiante</DialogTitle>
                    <DialogDescription>
                        Modifique el formulario para editar la información del estudiante
                    </DialogDescription>
                </DialogHeader>
                <StudentForm onFormSubmit={handleSubmit} defaultValues={student} />
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenEditStudentDialog(false)}>
                        Cancelar
                    </Button>
                    <Button form={STUDENT_FORM_ID} type='submit'>
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
