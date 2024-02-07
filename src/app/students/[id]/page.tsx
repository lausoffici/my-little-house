import api from '@/api';

export default async function StudentPage({ params: { id } }: { params: { id: string } }) {
    const student = await api.getStudent(id);

    return (
        <div>
            <h1>{`${student.firstName} ${student.lastName}`}</h1>
        </div>
    );
}
