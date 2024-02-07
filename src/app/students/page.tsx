import api from '@/api';
import DataTable from '@/components/ui/data-table/data-table';

import { columns } from './columns';

export default async function Students() {
    const students = await api.getStudents();
    return (
        <div>
            <h1 className='text-3xl font-bold text-foreground'>Estudiantes</h1>
            <DataTable columns={columns} data={students} />
        </div>
    );
}
