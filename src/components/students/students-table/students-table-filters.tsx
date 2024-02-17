'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { AVAILABLE_COURSES } from '@/lib/variables';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export default function StudentsTableFilters<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className='flex items-center justify-between gap-2 w-full'>
            <div className='flex flex-1 items-center space-x-2'>
                <Input
                    placeholder='Filtrar apellidos...'
                    value={(table.getColumn('lastName')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('lastName')?.setFilterValue(event.target.value)}
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                {table.getColumn('courses') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('courses')}
                        title='Cursos'
                        options={AVAILABLE_COURSES}
                    />
                )}
                {isFiltered && (
                    <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
                        Resetear
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
