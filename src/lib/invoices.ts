import { InvoiceState } from '@prisma/client';
import { cache } from 'react';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getPaginationClause } from './utils';
import { expiredInvoiceListSearchParamsSchema } from './validations/params';

export const getExpiredInvoiceList = async (searchParams: SearchParams) => {
  const { page, size, sortBy, sortOrder } = expiredInvoiceListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    state: InvoiceState.I,
    expiredAt: { lt: new Date() }
  };

  // Get the total count of students
  const totalInvoicesCount = await prisma.invoice.count({
    where: whereClause
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalInvoicesCount / pageSize);

  const totalExpiredAmount = await prisma.invoice.aggregate({
    _sum: {
      amount: true
    },
    where: whereClause
  });

  const pagination = getPaginationClause(pageNumber, pageSize);

  const invoices = await prisma.invoice.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      course: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    ...pagination
  });

  return { data: invoices, totalPages, totalExpiredAmount: totalExpiredAmount._sum.amount };
};

export const getUnpaidInvoicesByStudent = cache(async (id: number) => {
  return await prisma.invoice.findMany({
    where: {
      studentId: id,
      state: 'I'
    }
  });
});
