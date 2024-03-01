'use client';

import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { StudentWithCourses } from '@/types';

export const columns: ColumnDef<StudentWithCourses>[] = [
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Apellido' />
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nombre' />
  },
  {
    accessorKey: 'studentByCourse',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cursos' />,
    cell: ({ row }) => {
      const student = row.original;
      const courses: Course[] = student.studentByCourse.map(({ course }) => course);

      return (
        <div className='flex space-x-2'>
          {courses.map(({ id, name }) => (
            <Badge key={id} variant='secondary'>
              {name}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
      const id = student.id.toString();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/students/${id}`}>Ver detalles</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
