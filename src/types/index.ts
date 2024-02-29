import { InvoiceState, type Prisma } from '@prisma/client';

import { variants } from '@/components/ui/badge';
import { getExpiredInvoiceList } from '@/lib/invoices';
import { getReceiptItemsById, getReceiptsByDate } from '@/lib/receipts';

export interface PageProps<T extends object = {}> {
    params: T;
    searchParams: Record<string, string | string[] | undefined>;
}

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

export type ReceiptsWithStudents = Awaited<ReturnType<typeof getReceiptsByDate>>['data'][0];

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

export type InvoiceListItem = Awaited<ReturnType<typeof getExpiredInvoiceList>>['data'][0];

export type InvoiceDataType = {
    month: number;
    year: number;
    description: string;
    amount: number;
    balance: number;
    state: InvoiceState;
    expiredAt: Date;
    studentId: number;
    courseId: number;
};

export type AdditionalData = {
    description: string;
    amount: number;
    paymentDate: Date;
    studentId: number;
};

export type ItemsData = {
    description: string;
    amount: number;
    receiptId: number;
};
