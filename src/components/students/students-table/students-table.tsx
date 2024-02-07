import DataTable from '@/components/ui/data-table';
import { IStudent } from '@/types';

import { columns } from './columns';

export default function StudentsTable({ students }: { students: IStudent[] }) {
    return <DataTable columns={columns} data={students} />;
}
