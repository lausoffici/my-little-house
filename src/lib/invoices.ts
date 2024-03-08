'use server';

import { InvoiceState } from '@prisma/client';
import { cache } from 'react';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getPaginationClause } from './utils';
import { scholarshipFormSchema } from './validations/form';
import { expiredInvoiceListSearchParamsSchema } from './validations/params';

export const getExpiredInvoiceList = async (searchParams: SearchParams) => {
  const { page, size, sortBy, sortOrder } = expiredInvoiceListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    state: InvoiceState.I,
    expiredAt: { lt: new Date() }
  };

  // Get the total count of expired invoices
  const totalInvoicesCount = await prisma.invoice.count({
    where: whereClause
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalInvoicesCount / pageSize);

  const totalExpiredAmount = await prisma.$queryRaw<{ total: number }[]>`
    SELECT SUM(amount * (1 - discount)) AS total
    FROM "Invoice" 
    WHERE state = 'I' AND "expiredAt" < NOW()
  `;

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

  return { data: invoices, totalPages, totalExpiredAmount: totalExpiredAmount[0].total };
};

export const getUnpaidInvoicesByStudent = cache(async (id: number) => {
  return await prisma.invoice.findMany({
    where: {
      studentId: id,
      state: InvoiceState.I
    }
  });
});

export const scholarshipInvoice = async (_: any, formData: FormData) => {
  const parsedData = scholarshipFormSchema.safeParse({
    invoiceId: Number(formData.get('invoiceId'))
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al becar: el recibo no existe'
    };
  }

  try {
    await prisma.invoice.update({
      data: {
        state: InvoiceState.B,
        paymentDate: new Date()
      },
      where: {
        id: parsedData.data.invoiceId
      }
    });

    return {
      error: false,
      message: 'Cuota becada con éxito'
    };
  } catch (error) {
    return {
      error: true,
      message: 'Error al becar'
    };
  }
};

export const updateAmount = async (_: any, formData: FormData) => {
  const invoiceId = Number(formData.get('invoiceId'));
  const amount = Number(formData.get('amount'));

  try {
    await prisma.invoice.update({
      data: {
        amount
      },
      where: {
        id: invoiceId
      }
    });

    return {
      error: false,
      message: 'Monto actualizado con éxito'
    };
  } catch (error) {
    return {
      error: true,
      message: 'Error al actualizar el monto'
    };
  }
};
