import api from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default async function Courses() {
    const courses = await api.getCourses();

    return (
        <section className='p-5 h-full overflow-hidden relative'>
            <div className='flex justify-between items-center gap-2 p-2'>
                <div className='w-4/5'>
                    <h1 className='text-brand-black-100 text-3xl font-semibold'>Cursos</h1>
                </div>
                <Button>Agregar curso</Button>
            </div>

            <div
                className={`my-5 grid auto-rows-[190px] grid-cols-[repeat(auto-fit,minmax(332px,_1fr))] gap-4 overflow-scroll h-full no-scrollbar`}
            >
                {courses.map(({ _id, name, schedule, amount }) => (
                    <Card key={_id} className={`p-4 flex flex-col gap-1 waves min-w-[310px]`}>
                        <CardHeader className='py-2 px-0'>
                            <CardTitle className='text-lg'>{name}</CardTitle>
                        </CardHeader>
                        <CardContent className='p-0 text-sm'>
                            <ul>
                                {schedule.map((days, i) => (
                                    <li key={i}>{days}</li>
                                ))}
                            </ul>
                            <Badge variant='secondary' className='px-1 mt-2 w-fit text-md'>
                                {formatCurrency(amount)}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
