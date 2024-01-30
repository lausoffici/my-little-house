'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CourseForm from './CourseForm';

export default function AddCourseDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Crear Curso</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px'>
                <DialogHeader>
                    <DialogTitle className='text-brand-black-100'>Nuevo Curso</DialogTitle>
                </DialogHeader>
                <CourseForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
