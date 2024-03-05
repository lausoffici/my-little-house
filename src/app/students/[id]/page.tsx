import React from 'react';

import DeleteCourseEnrollmentDialog from '@/components/courses/delete-course-enrollment/delete-course-enrollment-dialog';
import ChargeInvoicesDialog from '@/components/invoices/charge-invoices-dialog';
import DeleteStudentDialog from '@/components/students/delete-student-dialog';
import EditStudentDialog from '@/components/students/edit-student-dialog';
import EnrollStudentDialog from '@/components/students/enroll-student/enroll-student-dialog';
import StudentDetail from '@/components/students/student-detail';
import DiscountsFormDialog from '@/components/students/student-discounts-dialog';
import StudentInvoicesFilters from '@/components/students/student-invoices-filters';
import StudentInvoicesTable from '@/components/students/student-invoices-table/student-invoices-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getCourseOptions } from '@/lib/courses';
import { getUnpaidInvoicesByStudent } from '@/lib/invoices';
import { getStudentById, getStudentInvoices } from '@/lib/students';
import { formatDate } from '@/lib/utils';
import { PageProps } from '@/types';

export default async function StudentPage({ params: { id }, searchParams }: PageProps<{ id: string }>) {
  const student = await getStudentById(Number(id));
  const courseOptionsPromise = getCourseOptions();
  const invoicesPromise = getStudentInvoices(Number(id), searchParams);
  const unpaidInvoicesPromise = getUnpaidInvoicesByStudent(Number(id));

  if (!student) {
    return <div>Student not found</div>;
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const courses = student.studentByCourse.map(({ course }) => course);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <div className='flex  flex-col gap-3'>
          <h1 className='text-3xl font-bold text-foreground'>{fullName}</h1>
          <div className='flex items-center gap-2'>
            <Label className='font-semibold leading-none tracking-tight'>Cursos:</Label>
            <div>
              {courses.length > 0 ? (
                courses.map(({ id, name }) => (
                  <Badge variant='secondary' key={id} className='py-1 px-2 text-sm mr-2'>
                    {name}
                  </Badge>
                ))
              ) : (
                <span className='text-sm text-gray-500'>Ningún curso asignado</span>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-1 justify-end'>
          <DeleteStudentDialog studentWithCourses={student} />
          <div className='flex gap-1'>
            <EnrollStudentDialog courseOptionsPromise={courseOptionsPromise} enrolledCourses={courses} />
            {courses.length > 0 && (
              <DeleteCourseEnrollmentDialog enrolledCourses={courses} studentByCourse={student.studentByCourse} />
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-3'>
        <Card className='w-[30%]'>
          <CardHeader className='flex flex-row justify-between w-full'>
            <CardTitle> Información personal</CardTitle>
            <EditStudentDialog student={student} />
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3 justify-center'>
              <StudentDetail label='Nombre' info={student.firstName} />
              <Separator />
              <StudentDetail label='Apellido' info={student.lastName} />
              <Separator />
              <StudentDetail label='Fecha de Nacimiento' info={formatDate(student.birthDate)} />
              <Separator />
              <StudentDetail label='Dni' info={student.dni} />
              <Separator />
              <StudentDetail label='Dirección' info={student.address} />
              <Separator />
              <StudentDetail label='Localidad' info={student.city} />
              <Separator />
              <StudentDetail label='Email' info={student.email} />
              <Separator />
              <StudentDetail label='Teléfono' info={student.phone} />
              <Separator />
              <StudentDetail label='Celular' info={student.mobilePhone} />
              <Separator />
              <StudentDetail label='Celular Madre/tutora' info={student.momPhone} />
              <Separator />
              <StudentDetail label='Celular Padre/tutor' info={student.dadPhone} />
              <Separator />
              <StudentDetail label='Observaciones' info={student.observations} />
            </div>
          </CardContent>
        </Card>
        <Card className='w-[70%]'>
          <CardHeader>
            <CardTitle>Cuotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between w-full mb-4'>
              <StudentInvoicesFilters />
              <div className='flex gap-2'>
                {courses.length > 0 && <DiscountsFormDialog studentByCourse={student.studentByCourse} />}
                <ChargeInvoicesDialog unpaidInvoicesPromise={unpaidInvoicesPromise} />
              </div>
            </div>
            <React.Suspense fallback='Cargando...'>
              <StudentInvoicesTable invoicesPromise={invoicesPromise} />
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
