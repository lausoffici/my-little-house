import { type Prisma } from '@prisma/client';
import { VariantProps } from 'class-variance-authority';

import { BadgeProps, badgeVariants, variants } from '@/components/ui/badge';

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
    createdAt: Date;
};

export type InvoicesStatusType = Record<string, { text: string; color: keyof (typeof variants)['variant'] }>;
