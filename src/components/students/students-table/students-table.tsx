'use client';

import React from 'react';

import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getStudentList, getStudentSheetData } from '@/lib/students';
import { Option, StudentWithCourses } from '@/types';

import { columns } from './columns';
import StudentsTableFilters from './students-table-filters';

export const filterableColumns = ['studentByCourse'];
export const searchableColumns = ['lastName'];

type StudentsTableProps = {
  studentsPromise: ReturnType<typeof getStudentList>;
  studentSheetDataPromise: ReturnType<typeof getStudentSheetData>;
  courseOptions: Option[];
};

export default function StudentsTable({ studentsPromise, courseOptions, studentSheetDataPromise }: StudentsTableProps) {
  const { data, totalPages, totalItems } = React.use(studentsPromise);

  const table = useURLManagedDataTable<StudentWithCourses>({
    data,
    columns,
    pageCount: totalPages,
    searchableColumns,
    filterableColumns
  });

  return (
    <>
      <div className='flex items-center py-4'>
        <StudentsTableFilters
          table={table}
          courseOptions={courseOptions}
          studentSheetDataPromise={studentSheetDataPromise}
        />
      </div>

      <DataTable table={table} columns={columns} withRowSelection={false} totalItems={totalItems} />
    </>
  );
}
