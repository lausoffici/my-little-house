import React from 'react';

import ChargeInvoicesDialog from '@/components/invoices/charge-invoices-dialog';
import DeleteStudentDialog from '@/components/students/delete-student-dialog';
import EditStudentDialog from '@/components/students/edit-student-dialog';
import StudentDetail from '@/components/students/student-detail';
import StudentInvoicesFilters from '@/components/students/student-invoices-filters';
import StudentInvoicesTable from '@/components/students/student-invoices-table/student-invoices-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getCourseOptions } from '@/lib/courses';
import { getUnpaidInvoicesByStudent } from '@/lib/invoices';
import { getStudentById, getStudentInvoices } from '@/lib/students';
import { formateDate } from '@/lib/utils';
import { PageProps } from '@/types';

export default async function StudentPage({ params: { id }, searchParams }: PageProps<{ id: string }>) {
  const student = await getStudentById(Number(id));
  const courseOptions = await getCourseOptions();
  const invoicesPromise = getStudentInvoices(Number(id), searchParams);
  const unpaidInvoicesPromise = getUnpaidInvoicesByStudent(Number(id));

  if (!student) {
    return <div>Student not found</div>;
  }

  const { firstName, lastName, birthDate, dni, address, city, phone, mobilePhone, momPhone, dadPhone, observations } =
    student;

  const fullName = `${firstName} ${lastName}`;
  const courses = student.studentByCourse.map(({ course }) => course);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <div className='flex  flex-col gap-1'>
          <h1 className='text-3xl font-bold text-foreground'>{fullName}</h1>
        </div>
        <DeleteStudentDialog studentWithCourses={student} />
      </div>

      <div className='flex flex-row gap-3'>
        <Card className='w-2/4'>
          <CardHeader className='flex flex-row justify-between w-full'>
            <CardTitle> Información personal</CardTitle>
            <EditStudentDialog student={student} courseOptions={courseOptions} />
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3 justify-center'>
              <StudentDetail label='Nombre' info={firstName} />
              <Separator />
              <StudentDetail label='Apellido' info={lastName} />
              <Separator />
              <StudentDetail label='Fecha de Nacimiento' info={birthDate ? formateDate(birthDate) : null} />
              <Separator />
              <StudentDetail label='Dni' info={dni} />
              <Separator />
              <StudentDetail label='Dirección' info={address} />
              <Separator />
              <StudentDetail label='Localidad' info={city} />
              <Separator />
              <StudentDetail label='Teléfono' info={phone} />
              <Separator />
              <StudentDetail label='Celular' info={mobilePhone} />
              <Separator />
              <StudentDetail label='Celular Madre/tutora' info={momPhone} />
              <Separator />
              <StudentDetail label='Celular Padre/tutor' info={dadPhone} />
              <Separator />
              <StudentDetail label='Observaciones' info={observations} />
              <Separator />
              <div className='flex items-center gap-2'>
                <Label className='text-xs'>Cursos </Label>
                <div>
                  {courses.map(({ id, name }) => (
                    <Badge variant='secondary' key={id} className='py-1 px-2 text-sm mr-2'>
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='w-2/4'>
          <CardHeader>
            <CardTitle className='mb-4'>Cuotas</CardTitle>
            <div className='flex justify-between w-full'>
              <StudentInvoicesFilters />
              <ChargeInvoicesDialog unpaidInvoicesPromise={unpaidInvoicesPromise} />
            </div>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback='Cargando...'>
              <StudentInvoicesTable invoicesPromise={invoicesPromise} />
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
