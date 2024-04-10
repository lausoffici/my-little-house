'use server';

import { InvoiceState } from '@prisma/client';
import { cache } from 'react';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { convertToCSV, getErrorMessage, getMonthName, getPaginationClause } from './utils';
import { header } from './utils/varaibles';
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
    orderBy: {
      [sortBy]: sortOrder
    },
    ...pagination
  });

  const activeStudentsInvoices = invoices.filter((invoice) => invoice.student.active);

  return { data: activeStudentsInvoices, totalPages, totalExpiredAmount: totalExpiredAmount[0].total };
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
    console.log(error);
    return {
      error: true,
      message: getErrorMessage(error)
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

export const getExpiredInvoicesCSVData = async () => {
  try {
    const data = await prisma.invoice.findMany({
      where: {
        state: InvoiceState.I,
        expiredAt: { lt: new Date() }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
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
        year: 'desc'
      }
    });

    const necessaryData = data.map((item) => ({
      name: `${item.student.firstName} ${item.student.lastName}`,
      description: item.description,
      amount: item.amount,
      month: getMonthName(item.month),
      year: item.year,
      course: item.course?.name,
      phone: item.student.phone,
      mobilePhone: item.student.mobilePhone,
      momPhone: item.student.momPhone,
      dadPhone: item.student.dadPhone,
      observations: item.student.observations
    }));

    // // Convert the data into CSV format
    const dataCSV = convertToCSV(necessaryData, header);

    return dataCSV;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
