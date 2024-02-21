'use client';

import { ArrowRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

const MINIMUM_CHARACTERS = 4;

export const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [studentNames, setStudentNames] = useState<{ id: string; firstName: string; lastName: string }[]>([]);

    // Function to fetch student names from an API
    const debouncedFetchStudentNames = useDebouncedCallback(async (searchTerm: string) => {
        if (searchTerm.length < MINIMUM_CHARACTERS) {
            setStudentNames([]);
            return;
        }
        try {
            const response = await fetch(`/api/students?query=${searchTerm}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStudentNames(data.studentNames);
        } catch (error) {
            console.error('Failed to fetch student names:', error);
            setStudentNames([]);
        }
    }, 1_000);

    function handleSearch(searchTerm: string) {
        setInputValue(searchTerm);
        debouncedFetchStudentNames(searchTerm);
    }

    return (
        <div className='relative md:w-2/3 lg:w-1/3'>
            <MagnifyingGlassIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
            <div
                onBlur={(e) => {
                    // Nessary to prevent the dropdown from closing when clicking on a link
                    if (e.currentTarget.contains(e.relatedTarget)) {
                        return;
                    }
                    setIsDropdownOpen(false);
                }}
            >
                <Input
                    className='w-full bg-white shadow-none appearance-none pl-8 dark:bg-gray-950'
                    placeholder='Buscar...'
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    value={inputValue}
                />
                {studentNames.length > 0 && isDropdownOpen && (
                    <div className='absolute top-10 left-0 flex flex-col bg-white border rounded text-foreground w-full'>
                        {studentNames.map(({ id, firstName, lastName }) => (
                            <Link
                                key={id}
                                href={`/students/${id}`}
                                className='flex justify-between items-center text-sm font-medium bg-white hover:bg-gray-200 p-2 last:border-b-0 border-b'
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setInputValue('');
                                }}
                            >
                                <div>
                                    {firstName} {lastName}
                                </div>
                                <span>
                                    <ArrowRightIcon />
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
