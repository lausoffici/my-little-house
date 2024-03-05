import React from 'react';

import AddStudentDialog from '@/components/students/add-student-dialog/add-student-dialog';
import StudentsTable from '@/components/students/students-table/students-table';
import { getCourseOptions } from '@/lib/courses';
import { getStudentList } from '@/lib/students';
import { PageProps } from '@/types';

export default async function Students({ searchParams }: PageProps) {
  const courseOptions = await getCourseOptions();
  const studentsPromise = getStudentList(searchParams);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Estudiantes</h1>
        <AddStudentDialog />
      </div>
      <React.Suspense fallback='Loading...'>
        <StudentsTable studentsPromise={studentsPromise} courseOptions={courseOptions} />
      </React.Suspense>
    </div>
  );
}
