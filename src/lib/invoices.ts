'use server';

import { InvoiceState, Prisma } from '@prisma/client';
import { cache } from 'react';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { formatCurrency, getErrorMessage, getMonthName, getPaginationClause } from './utils';
import { getDiscountedAmount } from './utils/invoices.utils';
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
    SELECT SUM(amount * (1 - discount) - balance) AS total
    FROM "Invoice" i INNER JOIN "Student" s ON i."studentId" = s.id AND s.active = true
    WHERE state = 'I' AND "expiredAt" < current_timestamp
  `;

  const pagination = getPaginationClause(pageNumber, pageSize);

  const baseQueryOptions = {
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
        totalExpiredAmount: totalExpiredAmount[0].total
      };

    case 'total':
    case 'rest':
      // For total and rest, we need to fetch all matching records and sort in memory
      // since Prisma doesn't support ordering by computed fields
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
        totalExpiredAmount: totalExpiredAmount[0].total
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
        totalExpiredAmount: totalExpiredAmount[0].total
      };
  }
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

export const getExpiredInvoicesData = async (searchParams: SearchParams) => {
  const { sortOrder } = expiredInvoiceListSearchParamsSchema.parse(searchParams);
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
        student: {
          firstName: sortOrder as Prisma.SortOrder
        }
      }
    });

    return data.map((item) => ({
      Nombre: `${item.student?.firstName} ${item.student?.lastName} `,
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
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export async function addEnrollmentInvoice(_: unknown, formData: FormData) {
  try {
    const studentId = Number(formData.get('studentId'));
    const enrollmentId = Number(formData.get('enrollmentId'));

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      }
    });

    if (!enrollment) {
      return {
        error: true,
        message: 'Error al agregar la matrícula: la matrícula no existe'
      };
    }

    await prisma.studentEnrollment.create({
      data: {
        year: enrollment.year,
        studentId: studentId
      }
    });

    await prisma.invoice.create({
      data: {
        month: 1,
        year: enrollment.year,
        description: `Matrícula ${enrollment.year}`,
        amount: enrollment.amount,
        balance: 0,
        state: 'I',
        expiredAt: new Date(),
        courseId: null,
        studentId
      }
    });

    return {
      error: false,
      message: 'Matrícula agregada exitosamente'
    };
  } catch (error) {
    console.error('Error al agregar la matrícula:', error);
    return {
      error: true,
      message: 'Error al agregar la matrícula: ' + getErrorMessage(error)
    };
  }
}
