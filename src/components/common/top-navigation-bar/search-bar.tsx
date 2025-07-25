import { ArrowRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

const MINIMUM_CHARACTERS = 4;

export const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studentNames, setStudentNames] = useState<
    { id: string; firstName: string; lastName: string; active: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedFetchStudentNames = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.length < MINIMUM_CHARACTERS) {
      setStudentNames([]);
      setError('');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/students?query=${searchTerm}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStudentNames(data.studentNames);

      if (data.studentNames.length === 0) {
        setError('No se encontraron estudiantes');
      }
    } catch (error) {
      console.error('Failed to fetch student names:', error);
      setError('Error al buscar estudiantes');
      setStudentNames([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  function handleSearch(searchTerm: string) {
    setInputValue(searchTerm);
    if (searchTerm.length >= MINIMUM_CHARACTERS) {
      setIsLoading(true);
      debouncedFetchStudentNames(searchTerm);
    } else {
      setStudentNames([]);
      setError('');
    }
  }

  return (
    <div className='relative md:w-2/3 lg:w-1/3'>
      <MagnifyingGlassIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
      <div
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget)) {
            return;
          }
          setIsDropdownOpen(false);
        }}
      >
        <Input
          className='w-full bg-white shadow-none appearance-none pl-8 dark:bg-gray-950'
          placeholder='Buscar estudiante...'
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          value={inputValue}
          type='search'
        />

        {isDropdownOpen && (
          <div className='absolute top-10 left-0 flex flex-col bg-white border rounded text-foreground w-full z-10'>
            <DropdownContent studentNames={studentNames} inputValue={inputValue} isLoading={isLoading} error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

type DropdownContentProps = {
  studentNames: { id: string; firstName: string; lastName: string; active: boolean }[];
  inputValue: string;
  isLoading: boolean;
  error: string;
};

function DropdownContent({ studentNames, inputValue, isLoading, error }: DropdownContentProps) {
  if (isLoading) {
    return <div className='p-2 text-center font-medium text-xs text-gray-600'>Cargando...</div>;
  }

  if (error) {
    return <div className='p-2 text-center font-medium text-xs text-gray-600'>{error}</div>;
  }

  if (studentNames.length > 0) {
    return studentNames.map(({ id, firstName, lastName, active }) => (
      <Link
        key={id}
        href={`/students/${id}`}
        className='flex justify-between items-center text-sm font-medium bg-white hover:bg-gray-200 p-2 last:border-b-0 border-b'
      >
        <div className='flex items-center gap-2'>
          <span>
            {firstName} {lastName}
          </span>
          {!active && (
            <span className='inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
              Inactivo
            </span>
          )}
        </div>
        <ArrowRightIcon />
      </Link>
    ));
  }

  if (inputValue.length >= MINIMUM_CHARACTERS) {
    return <div className='p-2 text-center font-medium text-xs text-gray-600'>No se encontraron estudiantes</div>;
  }

  return (
    <div className='p-2 text-center font-medium text-xs text-gray-600'>
      Ingresa al menos {MINIMUM_CHARACTERS} caracteres
    </div>
  );
}
