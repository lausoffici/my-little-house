'use client';

import { Course } from '@prisma/client';
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
import { getStudentById } from '@/lib/students';

import DeleteCourseEnrollmentForm, { DELETE_ENROLLMENT_FORM_ID } from './delete-course-enrollment-form';

interface DeleteCourseEnrollmentDialogProps {
  enrolledCourses: Course[];
  studentByCourse: NonNullable<Awaited<ReturnType<typeof getStudentById>>>['studentByCourse'];
}

export default function DeleteCourseEnrollmentDialog({
  enrolledCourses,
  studentByCourse
}: DeleteCourseEnrollmentDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Eliminar Curso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar curso</DialogTitle>
          <DialogDescription>Seleccione el curso a eliminar</DialogDescription>
        </DialogHeader>
        <DeleteCourseEnrollmentForm
          enrolledCourses={enrolledCourses}
          onOpenDialogChange={setOpenDialog}
          studentByCourse={studentByCourse}
        />
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button variant='destructive' form={DELETE_ENROLLMENT_FORM_ID} type='submit'>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
