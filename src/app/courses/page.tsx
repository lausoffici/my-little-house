import api from '@/api';
import AddCourseDialog from '@/components/AddCourseDialog';
import CourseCardMenu from '@/components/CourseCardMenu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function Courses() {
    const courses = await api.getCourses();

    return (
        <section className='p-6 h-full'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-foreground'>Cursos</h1>
                <AddCourseDialog />
            </div>
            <div className='h-[93%] overflow-y-auto no-scrollbar'>
                <div
                    className={`grid auto-rows-[fit-content(1em)] grid-cols-[repeat(auto-fit,minmax(250px,_1fr))] gap-4 overflow-scroll no-scrollbar`}
                >
                    {courses.map(({ _id, name, description, amount }) => (
                        <Card key={_id} className='shadow-sm'>
                            <CardHeader className='flex-row items-center justify-between relative'>
                                <CardTitle className='w-4/5'>{name}</CardTitle>
                                <CourseCardMenu />
                            </CardHeader>
                            <CardContent>
                                <p className='text-gray-600'>{description}</p>
                                <Badge variant='secondary' className='px-1 mt-2 w-fit text-md'>
                                    {formatCurrency(amount)}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
