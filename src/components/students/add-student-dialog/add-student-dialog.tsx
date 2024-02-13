'use client';

import { PlusCircledIcon } from '@radix-ui/react-icons';
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

export default function AddStudentDialog() {
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const { toast } = useToast();

    function handleSubmit(newStudent: IStudent) {
        toast({
            description: `Estudiante creado: ${newStudent.firstName} ${newStudent.lastName}`,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        setOpenStudentDialog(false);
    }

    return (
        <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircledIcon /> <span className='ml-2'>Crear estudiante</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo estudiante</DialogTitle>
                    <DialogDescription>Complete el formulario para crear un nuevo estudiante</DialogDescription>
                </DialogHeader>
                <StudentForm onStudentFormSubmit={handleSubmit} />
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenStudentDialog(false)}>
                        Cancelar
                    </Button>
                    <Button form={STUDENT_FORM_ID} type='submit'>
                        Crear
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
