'use client';

import { Course } from '@prisma/client';
import { useState } from 'react';
import React from 'react';

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
import { getCourseOptions } from '@/lib/courses';

import EnrollStudentForm, { ENROLL_STUDENT_FORM_ID } from './enroll-student-form';

interface EnrollStudentDialogProps {
  courseOptionsPromise: ReturnType<typeof getCourseOptions>;
  enrolledCourses: Course[];
}

export default function EnrollStudentDialog({ courseOptionsPromise, enrolledCourses }: EnrollStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          Inscribir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscribir a curso</DialogTitle>
          <DialogDescription>Complete el formulario para inscribir al estudiante en un curso</DialogDescription>
        </DialogHeader>
        <React.Suspense fallback='Cargando...'>
          <EnrollStudentForm
            courseOptionsPromise={courseOptionsPromise}
            enrolledCourses={enrolledCourses}
            onOpenDialogChange={setIsOpen}
          />
        </React.Suspense>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button form={ENROLL_STUDENT_FORM_ID} type='submit'>
            Inscribir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
