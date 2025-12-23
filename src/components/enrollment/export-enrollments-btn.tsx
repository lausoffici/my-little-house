'use client';

import { DownloadIcon } from 'lucide-react';
import React from 'react';

import { getAllActiveStudentsWithEnrollmentStatus } from '@/lib/enrollment';
import { convertAndExportToXlsx, formatCurrency } from '@/lib/utils';

import { Button } from '../ui/button';

export function ExportEnrollmentsButton({
  studentsEnrollmentStatusPromise
}: {
  studentsEnrollmentStatusPromise: ReturnType<typeof getAllActiveStudentsWithEnrollmentStatus>;
}) {
  const studentsEnrollmentStatus = React.use(studentsEnrollmentStatusPromise);

  function handleExport() {
    // Preparar los datos para Excel
    const excelData = studentsEnrollmentStatus
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .map((status) => ({
        'Apellido y Nombre': `${status.lastName}, ${status.firstName}`,
        'Año de Matrícula': status.enrollmentYear,
        'Estado de Pago': status.paymentStatus,
        Debe: status.enrollmentAmount === status.balance ? formatCurrency(0) : formatCurrency(status.balance),
        Precio: formatCurrency(status.enrollmentAmount)
      }));

    convertAndExportToXlsx(excelData, 'Estado_de_Matriculas.xlsx');
  }

  return (
    <Button variant='outline' onClick={handleExport}>
      <DownloadIcon width={15} height={15} className='mr-2' />
      Exportar estado de matriculas
    </Button>
  );
}
