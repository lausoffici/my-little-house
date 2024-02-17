import AddStudentDialog from '@/components/students/add-student-dialog/add-student-dialog';
import StudentsTable from '@/components/students/students-table/students-table';
import { getStudentByFirstName } from '@/lib/students';

export default async function Students() {
    const students = await getStudentByFirstName('Agustin');

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-foreground'>Estudiantes</h1>
                <AddStudentDialog />
            </div>
            <StudentsTable students={students} />
        </div>
    );
}
