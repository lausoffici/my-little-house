'use client';

import { Student } from '@prisma/client';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Option } from '@/types';

interface StudentsTableFilters {
    table: Table<Student>;
    courseOptions: Option[];
}

const columnNamesMap = {
    lastName: 'Apellido',
    firstName: 'Nombre',
    studentByCourse: 'Cursos',
    actions: 'Acciones'
};

export default function StudentsTableFilters({ table, courseOptions }: StudentsTableFilters) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const [inputValue, setInputValue] = React.useState(
        () => (table.getColumn('lastName')?.getFilterValue() as string) ?? ''
    );

    const debouncedFilterByLastName = useDebouncedCallback((value: string) => {
        table.getColumn('lastName')?.setFilterValue(value);
    }, 300);

    function handleLastNameSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
        debouncedFilterByLastName(event.target.value);
    }

    function handleResetFilters() {
        table.resetColumnFilters();
        setInputValue('');
    }

    return (
        <div className='flex items-center justify-between gap-2 w-full'>
            <div className='flex flex-1 items-center space-x-2'>
                <Input
                    placeholder='Filtrar por apellido...'
                    value={inputValue}
                    onChange={handleLastNameSearch}
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                <DataTableFacetedFilter
                    column={table.getColumn('studentByCourse')}
                    title='Cursos'
                    options={courseOptions}
                />
                {isFiltered && (
                    <Button variant='ghost' onClick={handleResetFilters} className='h-8 px-2 lg:px-3'>
                        Resetear
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} columnNamesMap={columnNamesMap} />
        </div>
    );
}
