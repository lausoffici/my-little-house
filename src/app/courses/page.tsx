import api from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default async function Courses() {
    const courses = await api.getCourses();

    return (
        <section className='p-6 h-full overflow-hidden'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-brand-black-100'>Cursos</h1>
                <Button>Agregar curso</Button>
            </div>

            <div
                className={`grid auto-rows-[190px] grid-cols-[repeat(auto-fit,minmax(250px,_1fr))] gap-4 overflow-scroll h-full no-scrollbar`}
            >
                {courses.map(({ _id, name, description, amount }) => (
                    <Card key={_id} className='waves shadow-sm'>
                        <CardHeader>
                            <CardTitle>{name}</CardTitle>
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
        </section>
    );
}
