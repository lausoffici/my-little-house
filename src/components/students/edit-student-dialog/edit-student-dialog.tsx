'use client';

import { Pencil1Icon } from '@radix-ui/react-icons';
import { CheckIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
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
import { editStudent } from '@/lib/students';
import { Option, StudentWithCourses } from '@/types';

import StudentForm, { STUDENT_FORM_ID } from '../student-form';

type EditStudentDialogProps = {
    student: StudentWithCourses;
    courseOptions: Option[];
};

export default function EditStudentDialog({ student, courseOptions }: EditStudentDialogProps) {
    const [openEditStudentDialog, setOpenEditStudentDialog] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const {
        firstName,
        lastName,
        birthDate,
        dni,
        address,
        city,
        phone,
        mobilePhone,
        momPhone,
        dadPhone,
        observations,
        id
    } = student;

    async function handleSubmit(editedStudent: FormData) {
        toast({
            description: `Estudiante editado: ${editedStudent.get('firstName')} ${editedStudent.get('lastName')}`,
            icon: <CheckIcon width='20px' height='20px' />,
            variant: 'success'
        });
        await editStudent(id, editedStudent);
        router.refresh();
        setOpenEditStudentDialog(false);
    }

    const courses = student.studentByCourse.map(({ course }) => course.id.toString());

    const defaultValues = {
        firstName,
        lastName,
        courses,
        birthDate: birthDate || undefined,
        dni: dni || undefined,
        address: address || undefined,
        city: city || undefined,
        phone: phone || undefined,
        mobilePhone: mobilePhone || undefined,
        momPhone: momPhone || undefined,
        dadPhone: dadPhone || undefined,
        observations: observations || undefined
    };

    return (
        <Dialog open={openEditStudentDialog} onOpenChange={setOpenEditStudentDialog}>
            <DialogTrigger asChild>
                <Button variant='outline' size='sm' title='Editar' style={{ marginTop: 0 }}>
                    <Pencil1Icon className='mr-2' /> Editar
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Editar estudiante</DialogTitle>
                    <DialogDescription>
                        Modifique el formulario para editar la información del estudiante
                    </DialogDescription>
                </DialogHeader>
                <StudentForm onFormSubmit={handleSubmit} defaultValues={defaultValues} courseOptions={courseOptions} />
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
