import { type Prisma } from '@prisma/client';

export type Option = {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export type StudentWithCourses = Prisma.StudentGetPayload<{
    include: {
        studentByCourse: {
            include: {
                course: true;
            };
        };
    };
}>;

export type CashRegisterIncomingItem = {
    id: number;
    description: string;
    amount: number;
    receiptId: number;
    studentId: number;
    studentName: string;
};
