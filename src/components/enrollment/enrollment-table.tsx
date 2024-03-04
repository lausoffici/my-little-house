'use client';

import React from 'react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getEnrollments } from '@/lib/enrollment';
import { formatCurrency } from '@/lib/utils';

interface EnrollmentTableProps {
  createdEnrollmentsPromise: ReturnType<typeof getEnrollments>;
}

export default function EnrollmentTable({ createdEnrollmentsPromise }: EnrollmentTableProps) {
  const createdEnrollments = React.use(createdEnrollmentsPromise);
  const sortedEnrollments = createdEnrollments.sort((a, b) => a.year - b.year);

  return (
    <div className='border border-gray-300 rounded-2xl p-2'>
      <Table>
        <TableCaption>Lista de las matrículas creadas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ciclo Lectivo</TableHead>
            <TableHead>Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEnrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell className='font-medium'>{enrollment.year}</TableCell>
              <TableCell>{formatCurrency(enrollment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
