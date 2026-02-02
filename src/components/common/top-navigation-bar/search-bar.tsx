'use client';

import { ArrowRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

const MINIMUM_CHARACTERS = 4;

type Student = {
  id: number;
  firstName: string;
  lastName: string;
};

export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedFetchStudents = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.length < MINIMUM_CHARACTERS) {
      setStudents([]);
      setError('');
      setIsLoading(false);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/students?query=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const studentNames = Array.isArray(data.studentNames) ? data.studentNames : [];
      
      setStudents(studentNames);

      if (studentNames.length === 0) {
        setError('No se encontraron estudiantes');
      }
    } catch (error) {
      console.error('Failed to fetch student names:', error);
      setError('Error al buscar estudiantes');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleSearch = useCallback((searchTerm: string) => {
    setInputValue(searchTerm);
    
    if (searchTerm.length >= MINIMUM_CHARACTERS) {
      setIsLoading(true);
      debouncedFetchStudents(searchTerm);
    } else {
      setStudents([]);
      setError('');
      setIsLoading(false);
    }
  }, [debouncedFetchStudents]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDropdownOpen(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  return (
    <div className='relative md:w-2/3 lg:w-1/3'>
      <MagnifyingGlassIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
      <div onBlur={handleBlur}>
        <Input
          className='w-full bg-white shadow-none appearance-none pl-8 dark:bg-gray-950'
          placeholder='Buscar estudiante...'
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          value={inputValue}
          type='search'
        />

        {isDropdownOpen && (
          <div className='absolute top-10 left-0 flex flex-col bg-white border rounded text-foreground w-full z-10'>
            <DropdownContent 
              students={students} 
              inputValue={inputValue} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

type DropdownContentProps = {
  students: Student[];
  inputValue: string;
  isLoading: boolean;
  error: string;
};

function DropdownContent({ students, inputValue, isLoading, error }: DropdownContentProps) {
  if (isLoading) {
    return <div className='p-2 text-center font-medium text-xs text-gray-600'>Cargando...</div>;
  }

  if (error) {
    return <div className='p-2 text-center font-medium text-xs text-gray-600'>{error}</div>;
  }

  if (students.length > 0) {
    return (
      <>
        {students.map(({ id, firstName, lastName }) => (
          <Link
            key={id}
            href={`/students/${id}`}
            className='flex justify-between items-center text-sm font-medium bg-white hover:bg-gray-200 p-2 last:border-b-0 border-b'
          >
            <span>
              {firstName} {lastName}
            </span>
            <ArrowRightIcon />
          </Link>
        ))}
      </>
    );
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
