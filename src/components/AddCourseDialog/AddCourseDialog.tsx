'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import CourseForm, { FORM_ID } from '../CourseForm';
import { PlusCircledIcon } from '@radix-ui/react-icons';

export default function AddCourseDialog() {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircledIcon /> <span className='ml-2'>Crear Curso</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Curso</DialogTitle>
                    <DialogDescription>Complete el formulario para crear un nuevo curso</DialogDescription>
                </DialogHeader>
                <CourseForm onFormSubmit={() => setOpenDialog(false)} />
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button form={FORM_ID} type='submit'>
                        Crear
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
