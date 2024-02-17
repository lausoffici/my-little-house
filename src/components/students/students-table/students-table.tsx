'use client';

import { Student } from '@prisma/client';

import DataTable from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTableFilterableColumn, DataTableSearchableColumn, IStudent } from '@/types';

import { columns } from './columns';
import StudentsTableFilters from './students-table-filters';

export const filterableColumns: DataTableFilterableColumn<IStudent>[] = [
    {
        id: 'courses',
        title: 'Cursos',
        options: [
            { label: 'Curso 1', value: '1' },
            { label: 'Curso 2', value: '2' },
            { label: 'Curso 3', value: '3' }
        ]
    }
];

export const searchableColumns: DataTableSearchableColumn<IStudent>[] = [
    {
        id: 'lastName',
        title: 'Apellido'
    }
];

type StudentsTableProps = {
    students: Student[];
};

export default function StudentsTable({ students }: StudentsTableProps) {
    const table = useDataTable({ data: students, columns, pageCount: 1, searchableColumns, filterableColumns });

    return (
        <>
            <div className='flex items-center py-4'>
                <StudentsTableFilters table={table} />
            </div>

            <DataTable table={table} columns={columns} />
        </>
    );
}
