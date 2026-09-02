'use server';

import { InvoiceState, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { SearchParams } from '@/types';

import { authOptions, dashboardAllowedEmails } from './auth';
import prisma from './prisma';
import { formatCurrency, getMonthName, getPaginationClause } from './utils';
import { getDiscountedAmount } from './utils/invoices.utils';
import { debtorInvoiceListSearchParamsSchema } from './validations/params';

const assertDashboardAccess = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail || !dashboardAllowedEmails.includes(userEmail)) {
    throw new Error('No autorizado');
  }
};

export const markStudentAsDebtor = async (studentId: number) => {
  await assertDashboardAccess();

  const student = await prisma.student.update({
    where: { id: studentId },
    data: { isDebtor: true }
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath('/expirations');
  revalidatePath('/debtors');

  return student;
};

export const unmarkStudentAsDebtor = async (studentId: number) => {
  await assertDashboardAccess();

  const student = await prisma.student.update({
    where: { id: studentId },
    data: { isDebtor: false }
  });

  revalidatePath(`/students/${studentId}`);
  revalidatePath('/expirations');
  revalidatePath('/debtors');

  return student;
};

export const getDebtorInvoiceList = async (searchParams: SearchParams) => {
  const { page, size, sortBy, sortOrder, withInactiveStudents } =
    debtorInvoiceListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    state: InvoiceState.I,
    student: {
      isDebtor: true,
      active: withInactiveStudents === 'true' ? undefined : true
    }
  };

  const totalInvoicesCount = await prisma.invoice.count({
    where: whereClause
  });

  const totalPages = Math.ceil(totalInvoicesCount / pageSize);

  const debtorInvoicesForTotal = await prisma.invoice.findMany({
    where: whereClause,
    select: { amount: true, discount: true, balance: true }
  });

  const totalDebtAmount = debtorInvoicesForTotal.reduce(
    (sum, invoice) => sum + (getDiscountedAmount(invoice.amount, invoice.discount) - invoice.balance),
    0
  );

  const pagination = getPaginationClause(pageNumber, pageSize);

  const baseQueryOptions = {
    where: whereClause,
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          active: true
        }
      },
      course: {
        select: {
          name: true
        }
      }
    },
    ...pagination
  };

  switch (sortBy) {
    case 'student':
      const invoicesOrderedByStudent = await prisma.invoice.findMany({
        ...baseQueryOptions,
        orderBy: {
          student: {
            firstName: sortOrder as Prisma.SortOrder
          }
        }
      });
      return {
        data: invoicesOrderedByStudent,
        totalPages,
        totalDebtAmount
      };

    case 'total':
    case 'rest':
      const invoices = await prisma.invoice.findMany({
        ...baseQueryOptions,
        orderBy: undefined
      });

      const sortedInvoices = invoices.sort((a, b) => {
        const getComputedValue = (invoice: any) => {
          if (sortBy === 'total') return invoice.amount * (1 - invoice.discount);
          else return invoice.amount * (1 - invoice.discount) - invoice.balance;
        };

        const aValue = getComputedValue(a);
        const bValue = getComputedValue(b);

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });

      return {
        data: sortedInvoices,
        totalPages,
        totalDebtAmount
      };

    default:
      const regularInvoices = await prisma.invoice.findMany({
        ...baseQueryOptions,
        orderBy: {
          [sortBy]: sortOrder as Prisma.SortOrder
        }
      });

      return {
        data: regularInvoices,
        totalPages,
        totalDebtAmount
      };
  }
};

export const getDebtorInvoicesData = async (searchParams: SearchParams) => {
  const { sortOrder, withInactiveStudents } = debtorInvoiceListSearchParamsSchema.parse(searchParams);

  const data = await prisma.invoice.findMany({
    where: {
      state: InvoiceState.I,
      student: {
        isDebtor: true,
        active: withInactiveStudents === 'true' ? undefined : true
      }
    },
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          active: true,
          phone: true,
          mobilePhone: true,
          momPhone: true,
          dadPhone: true,
          observations: true
        }
      },
      course: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      student: {
        firstName: sortOrder as Prisma.SortOrder
      }
    }
  });

  return data.map((item) => ({
    Nombre: `${item.student?.firstName} ${item.student?.lastName} `,
    Estado: item.student.active ? 'Activo' : 'Inactivo',
    Debe: formatCurrency(getDiscountedAmount(item.amount, item.discount) - item.balance),
    Descripcion: item.description,
    Mes: getMonthName(item.month),
    'Ciclo lectivo': item.year,
    Telefono: item.student.phone,
    Celular: item.student.mobilePhone,
    'Celular madre': item.student.momPhone,
    'Celular padre': item.student.dadPhone,
    Observaciones: item.student.observations
  }));
};
