import { Student } from '@prisma/client';

import DataTable from '@/components/ui/data-table';

import { columns } from './columns';

type StudentsTableProps = {
    students: Student[];
};

export default function StudentsTable({ students }: StudentsTableProps) {
    return <DataTable columns={columns} data={students} />;
}
