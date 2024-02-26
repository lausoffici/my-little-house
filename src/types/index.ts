import { type Prisma } from '@prisma/client';

import { variants } from '@/components/ui/badge';
import { getReceiptItemsById } from '@/lib/receipts';

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

export type ReceiptsWithStudents = Prisma.ReceiptGetPayload<{
    select: {
        id: true;
        total: true;
        createdAt: true;
        student: {
            select: {
                firstName: true;
                lastName: true;
            };
        };
    };
}>;

export type ReceiptItems = Awaited<ReturnType<typeof getReceiptItemsById>>;

export type CashRegisterIncomingItem = {
    id: number;
    description: string;
    amount: number;
    receiptId: number;
    studentId: number;
    studentName: string;
    createdAt: Date;
};

export type InvoicesStatusType = Record<string, { text: string; color: keyof (typeof variants)['variant'] }>;
