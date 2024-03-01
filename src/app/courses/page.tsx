import AddCourseDialog from '@/components/courses/add-course-dialog';
import CourseCardMenu from '@/components/courses/course-card-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActiveCourses } from '@/lib/courses';
import { formatCurrency } from '@/lib/utils';

export default async function Courses() {
  const courses = await getActiveCourses();

  return (
    <section>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-foreground'>Cursos</h1>
        <AddCourseDialog />
      </div>
      <div
        className={`grid auto-rows-[fit-content(1em)] grid-cols-[repeat(auto-fit,minmax(250px,_1fr))] gap-4 overflow-scroll no-scrollbar`}
      >
        {courses.map((course) => (
          <Card key={course.id} className='shadow-sm'>
            <CardHeader className='flex-row items-center justify-between relative'>
              <CardTitle className='w-4/5'>{course.name}</CardTitle>
              <CourseCardMenu course={course} />
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>{course.observations}</p>
              <Badge variant='secondary' className='px-1 mt-2 w-fit text-md'>
                {formatCurrency(course.amount)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
