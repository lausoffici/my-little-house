'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CourseForm from './CourseForm';
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
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='text-brand-black-100'>Nuevo Curso</DialogTitle>
                </DialogHeader>
                <CourseForm onFormSubmit={() => setOpenDialog(false)} />
            </DialogContent>
        </Dialog>
    );
}
