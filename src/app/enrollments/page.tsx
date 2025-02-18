import EnrollmentCardMenu from '@/components/enrollment/enrollment-card-menu';
import EnrollmentDialog from '@/components/enrollment/enrollment-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEnrollments } from '@/lib/enrollment';
import { formatCurrency } from '@/lib/utils';

export default async function Enrollments() {
  const enrollments = await getEnrollments();

  return (
    <section>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Matrículas</h1>
        <div className='flex gap-2'>
          <EnrollmentDialog />
        </div>
      </div>
      <div className='grid auto-rows-[fit-content(1em)] grid-cols-[repeat(auto-fit,minmax(250px,_1fr))] gap-4 overflow-scroll no-scrollbar'>
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className='shadow-sm'>
            <CardHeader className='flex-row items-center justify-between relative'>
              <CardTitle className='w-4/5'>Matrícula {enrollment.year}</CardTitle>
              <EnrollmentCardMenu enrollment={enrollment} />
            </CardHeader>
            <CardContent>
              <Badge variant='secondary' className='px-1 mt-2 w-fit text-md'>
                {formatCurrency(enrollment.amount)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
