'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSearchParams } from '@/hooks/use-search-params';
import { createQueryString } from '@/lib/utils';
import { Option, StudentWithCourses } from '@/types';

interface StudentsTableFilters {
  table: Table<StudentWithCourses>;
  courseOptions: Option[];
}

const columnNamesMap = {
  id: 'Legajo',
  lastName: 'Apellido',
  firstName: 'Nombre',
  studentByCourse: 'Cursos',
  actions: 'Acciones'
};

export default function StudentsTableFilters({ table, courseOptions }: StudentsTableFilters) {
  const router = useRouter();

  const { searchParams } = useSearchParams();

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

  function handleSwitchChange(checked: boolean) {
    const newQueryString = createQueryString('withInactiveStudents', checked ? 'true' : null, searchParams);
    router.push(`${window.location.pathname}?${newQueryString}`);
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
        <DataTableFacetedFilter column={table.getColumn('studentByCourse')} title='Cursos' options={courseOptions} />
        {isFiltered && (
          <Button variant='ghost' onClick={handleResetFilters} className='h-8 px-2 lg:px-3'>
            Resetear
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
        <Switch
          id='students-state'
          checked={searchParams.get('withInactiveStudents') === 'true'}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor='students-state'>Incluir Inactivos</Label>
      </div>
      <DataTableViewOptions table={table} columnNamesMap={columnNamesMap} />
    </div>
  );
}
