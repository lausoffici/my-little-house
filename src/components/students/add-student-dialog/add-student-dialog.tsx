'use client';

import { ExclamationTriangleIcon, PlusCircledIcon } from '@radix-ui/react-icons';
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
import { createStudent } from '@/lib/students';
import { Option } from '@/types';

import StudentForm, { STUDENT_FORM_ID } from '../student-form';

type AddStudentDialogProps = { courseOptions: Option[] };

export default function AddStudentDialog({ courseOptions }: AddStudentDialogProps) {
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const { toast } = useToast();

    async function handleSubmit(newStudent: FormData) {
        try {
            await createStudent(newStudent);

            toast({
                description: `Estudiante creado: ${newStudent.get('firstName')} ${newStudent.get('lastName')}`,
                icon: <CheckIcon width='20px' height='20px' />,
                variant: 'success'
            });
            setOpenStudentDialog(false);
        } catch (error) {
            console.error(error);
            toast({
                description: `Ha ocurrido un error`,
                icon: <ExclamationTriangleIcon width='20px' height='20px' />,
                variant: 'destructive'
            });
        }
    }

    return (
        <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircledIcon /> <span className='ml-2'>Crear estudiante</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Nuevo estudiante</DialogTitle>
                    <DialogDescription>Complete el formulario para crear un nuevo estudiante</DialogDescription>
                </DialogHeader>
                <StudentForm onFormSubmit={handleSubmit} courseOptions={courseOptions} />
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
