'use server';

import { InvoiceState } from '@prisma/client';
import { cache } from 'react';

import { ExpiredInvoicesExcelData, SearchParams } from '@/types';

import prisma from './prisma';
import { getErrorMessage, getMonthName, getPaginationClause } from './utils';
import { scholarshipFormSchema } from './validations/form';
import { expiredInvoiceListSearchParamsSchema } from './validations/params';

export const getExpiredInvoiceList = async (searchParams: SearchParams) => {
  const { page, size, sortBy, sortOrder } = expiredInvoiceListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    state: InvoiceState.I,
    expiredAt: { lt: new Date().toISOString() },
    student: {
      active: true
    }
  };

  // Get the total count of expired invoices
  const totalInvoicesCount = await prisma.invoice.count({
    where: whereClause
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalInvoicesCount / pageSize);

  const totalExpiredAmount = await prisma.$queryRaw<{ total: number }[]>`
    SELECT SUM(amount * (1 - discount)) AS total
    FROM "Invoice" i INNER JOIN "Student" s ON i."studentId" = s.id AND s.active = true
    WHERE state = 'I' AND "expiredAt" < current_timestamp
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

export const getExpiredInvoicesData = async () => {
  try {
    const data = await prisma.invoice.findMany({
      where: {
        state: InvoiceState.I,
        expiredAt: { lt: new Date() },
        student: {
          active: true
        }
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

    const sheetData: ExpiredInvoicesExcelData[] = data.map((item) => ({
      nombre: `${item.student.firstName} ${item.student.lastName}`,
      descripcion: item.description,
      precio: item.amount,
      mes: getMonthName(item.month),
      'ciclo lectivo': item.year,
      curso: item.course?.name,
      telefono: item.student.phone,
      celular: item.student.mobilePhone,
      'celular madre': item.student.momPhone,
      'celular padre': item.student.dadPhone,
      observaciones: item.student.observations
    }));

    return sheetData;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
