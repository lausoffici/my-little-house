import api from '@/api';
import EditStudentDialog from '@/components/students/edit-student-dialog';
import StudentDetail from '@/components/students/student-detail';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default async function StudentPage({ params: { id } }: { params: { id: string } }) {
    const student = await api.getStudent(id);
    const { firstName, lastName, courses, email, description, address } = student;
    const fullName = `${firstName} ${lastName}`;

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <h1 className='text-3xl font-bold text-foreground'>{fullName}</h1>
                <p className='text-md text-foreground'>Detalles del estudiante</p>
            </div>

            <div className='flex flex-row gap-3'>
                <Card className='w-2/4'>
                    <CardHeader className='flex flex-row justify-between w-full'>
                        <CardTitle> Información personal</CardTitle>
                        <EditStudentDialog student={student} />
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col gap-3 justify-center'>
                            <StudentDetail label='Nombre' info={firstName} />
                            <Separator />
                            <StudentDetail label='Apellido' info={lastName} />
                            <Separator />
                            <StudentDetail label='Dirección' info={address} />
                            <Separator />
                            <StudentDetail label='Email' info={email} />
                            <Separator />
                            <StudentDetail label='Descripción' info={description} />
                            <Separator />
                            <div className='flex items-center gap-2'>
                                <Label className='text-xs'>Cursos </Label>
                                <div>
                                    {courses?.map((course) => (
                                        <Badge variant='secondary' key={course} className='py-1 px-2 text-sm mr-2'>
                                            {course}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className='w-2/4'>
                    <CardHeader>
                        <CardTitle>Cuotas</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </div>
    );
}
