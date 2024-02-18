'use client';

import { Student } from '@prisma/client';
import React from 'react';

import DataTable from '@/components/ui/data-table';
import { useURLManagedDataTable } from '@/hooks/use-url-managed-data-table';
import { getStudentList } from '@/lib/students';
import { Option } from '@/types';

import { columns } from './columns';
import StudentsTableFilters from './students-table-filters';

export const filterableColumns = ['studentByCourse'];
export const searchableColumns = ['lastName'];

type StudentsTableProps = {
    studentsPromise: ReturnType<typeof getStudentList>;
    courseOptions: Option[];
};

export default function StudentsTable({ studentsPromise, courseOptions }: StudentsTableProps) {
    const { data, totalPages } = React.use(studentsPromise);

    const table = useURLManagedDataTable<Student>({
        data,
        columns,
        pageCount: totalPages,
        searchableColumns,
        filterableColumns
    });

    return (
        <>
            <div className='flex items-center py-4'>
                <StudentsTableFilters table={table} courseOptions={courseOptions} />
            </div>

            <DataTable table={table} columns={columns} />
        </>
    );
}
