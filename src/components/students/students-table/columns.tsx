'use client';

import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

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
import { cn } from '@/lib/utils';
import { StudentWithCourses } from '@/types';

import ActivateStudentDialog from '../active-student-dialog';
import DeleteStudentDialog from '../delete-student-dialog';

export const columns: ColumnDef<StudentWithCourses>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Legajo' />,
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Link className='flex underline items-center' href={`/students/${id}`}>
          {id}
          <FiExternalLink className='ml-1 ' />
        </Link>
      );
    }
  },
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
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Estado' />,
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.original.active ? 'bg-green-600 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-500',
          'border-transparent'
        )}
      >
        {row.original.active ? 'Activo' : 'Inactivo'}
      </Badge>
    )
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
            {row.original.active ? (
              <DropdownMenuItem>
                <Link href={`/students/${id}`}>Ver detalles</Link>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <ActivateStudentDialog studentWithCourses={student} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteStudentDialog
                    studentWithCourses={student}
                    buttonTrigger={
                      <Button variant='ghost' className='p-0 w-full'>
                        Eliminar
                      </Button>
                    }
                  />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
