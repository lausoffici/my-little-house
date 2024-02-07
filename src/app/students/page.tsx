import api from '@/api';
import StudentsTable from '@/components/students/students-table/students-table';

export default async function Students() {
    const students = await api.getStudents();
    return (
        <div>
            <h1 className='text-3xl font-bold text-foreground'>Estudiantes</h1>
            <StudentsTable students={students} />
        </div>
    );
}
