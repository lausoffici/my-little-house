import { InvoiceState, type Prisma } from '@prisma/client';

import { variants } from '@/components/ui/badge';
import { getExpiredInvoiceList } from '@/lib/invoices';
import { getReceiptWithItemsById } from '@/lib/receipts';

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

export type ReceiptWithStudent = Prisma.ReceiptGetPayload<{
  include: {
    student: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

export type ReceiptItems = Awaited<ReturnType<typeof getReceiptWithItemsById>>;

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
  discount: number;
};

export type ErrorWithMessage = {
  message: string;
};
