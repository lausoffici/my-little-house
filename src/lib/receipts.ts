'use server';

import { InvoiceState, Prisma, ReceiptPaymentMethod } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { formatPercentage, getErrorMessage, getMonthName, getPaginationClause } from './utils';
import { getYearMonthDayFromSearchParams } from './utils/cash-register.utils';
import { getDiscountedAmount } from './utils/invoices.utils';
import { receiptFormSchema } from './validations/form';
import { receiptsByDateSchema } from './validations/params';

export const getReceiptsByDate = async (searchParams: SearchParams) => {
  const params = receiptsByDateSchema.parse(searchParams);
  const { page, size, sortBy, sortOrder } = params;
  const { dayNumber, monthNumber, yearNumber } = getYearMonthDayFromSearchParams(params);

  const startDate = new Date(yearNumber, monthNumber - 1, dayNumber);
  const endDate = new Date(yearNumber, monthNumber - 1, dayNumber + 1);
  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    createdAt: {
      gte: startDate,
      lt: endDate
    }
  };
  const orderByClause =
    sortBy === 'studentId'
      ? { student: { lastName: sortOrder as Prisma.SortOrder } }
      : {
          [sortBy]: sortOrder
        };

  const totalReceiptsCount = await prisma.receipt.count({ where: whereClause });

  const totalPages = Math.ceil(totalReceiptsCount / pageSize);

  const pagination = getPaginationClause(pageNumber, pageSize);

  const receipts = await prisma.receipt.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: orderByClause,
    ...pagination
  });

  return { data: receipts, totalPages };
};

export const getReceiptWithItemsById = (searchParams: SearchParams) => {
  const receiptId = Number(searchParams.receiptId);

  if (!receiptId) return Promise.resolve(null);

  return prisma.receipt.findFirst({
    where: {
      id: receiptId
    },
    include: {
      items: {
        select: {
          id: true,
          description: true,
          amount: true
        }
      },
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });
};

const processFormData = (formData: FormData, maxInputsAllowed: number) => {
  const selectedIds: string[] = [];
  const selectedAmounts: string[] = [];
  const additionalDescriptions: string[] = [];
  const additionalAmounts: string[] = [];

  for (let i = 0; i <= maxInputsAllowed; i++) {
    const selectedId = formData.get(`invoices.${i}.selectedId`);
    const additionalDescription = formData.get(`additionals.${i}.description`);
    const selectedAmount = formData.get(`invoices.${i}.amount`);
    const additionalAmount = formData.get(`additionals.${i}.amount`);

    const thereAreInvoices = selectedId && selectedAmount;
    const thereAreAdditionals = additionalDescription && additionalAmount;

    if (thereAreInvoices) {
      if (Number(selectedAmount) === 0) throw new Error('Complete los campos de la cuota');

      selectedIds.push(selectedId.toString());
      selectedAmounts.push(selectedAmount.toString());
    }

    if (thereAreAdditionals) {
      const additionalsAreEquals =
        additionalDescriptions.includes(additionalDescription.toString()) &&
        additionalAmounts.includes(additionalAmount.toString());

      if (additionalsAreEquals) {
        throw new Error('Error: dos adicionales son iguales');
      }

      additionalAmounts.push(additionalAmount.toString());
      additionalDescriptions.push(additionalDescription.toString());
    }
  }

  return { selectedIds, selectedAmounts, additionalDescriptions, additionalAmounts };
};

function combineAdditionals(descriptions: string[], amounts: string[]) {
  if (descriptions.length !== amounts.length) throw new Error('Arrays must have the same length');

  return descriptions.map((description, index) => ({ description, amount: amounts[index] }));
}
function combineInvoices(ids: string[], amounts: string[]) {
  if (ids.length !== amounts.length) throw new Error('Arrays must have the same length');

  return ids.map((id, index) => ({ id, amount: Number(amounts[index]) }));
}

export const generateReceipt = async (_: unknown, paidItems: FormData) => {
  const MAX_INPUTS_ALLOWED = 5;

  try {
    const parsedData = receiptFormSchema.safeParse({
      studentId: paidItems.get('studentId'),
      receiptTotal: paidItems.get('receiptTotal'),
      paymentMethod: paidItems.get('paymentMethod')
    });

    if (!parsedData.success) {
      return {
        error: true,
        message: 'Error al cobrar cuotas'
      };
    }

    const { studentId, receiptTotal, paymentMethod } = parsedData.data;
    const { selectedIds, selectedAmounts, additionalDescriptions, additionalAmounts } = processFormData(
      paidItems,
      MAX_INPUTS_ALLOWED
    );

    const additionals = combineAdditionals(additionalDescriptions, additionalAmounts);
    const invoices = combineInvoices(selectedIds, selectedAmounts);

    if (additionals.length === 0 && invoices.length === 0) {
      return {
        error: true,
        message: 'Error: seleccione al menos una cuota'
      };
    }

    const receipt = await prisma.$transaction(async (tx) => {
      const paidInvoices = await Promise.all(
        invoices.map(async ({ id, amount }) => {
          const currentInvoice = await tx.invoice.findUnique({
            where: {
              id: Number(id)
            }
          });

          if (!currentInvoice) throw new Error();

          const fullPrice =
            currentInvoice.amount === amount || currentInvoice.amount - currentInvoice.balance === amount;

          if (fullPrice) {
            return tx.invoice.update({
              where: {
                studentId: Number(studentId),
                id: Number(id)
              },
              data: {
                state: fullPrice ? InvoiceState.P : InvoiceState.I,
                paymentDate: new Date(),
                balance: fullPrice ? currentInvoice.amount : amount
              }
            });
          } else {
            const discAmount = getDiscountedAmount(currentInvoice.amount, currentInvoice.discount);
            const fullDiscPrice = discAmount === amount || discAmount - currentInvoice.balance === amount;

            return tx.invoice.update({
              where: {
                studentId: Number(studentId),
                id: Number(id)
              },
              data: {
                state: fullDiscPrice ? InvoiceState.P : InvoiceState.I,
                paymentDate: new Date(),
                balance: fullDiscPrice ? discAmount : amount
              }
            });
          }
        })
      );

      const receipt = await tx.receipt.create({
        data: {
          studentId: Number(studentId),
          total: Number(receiptTotal),
          paymentMethod
        }
      });

      const mappedAdditionals = additionals.map(({ description, amount }) => ({
        description,
        amount: Number(amount),
        paymentDate: new Date(),
        studentId: Number(studentId),
        items: {
          create: [
            {
              description,
              amount: Number(amount),
              receiptId: receipt.id
            }
          ]
        }
      }));

      await tx.item.createMany({
        data: paidInvoices.map(({ id, description, month, year, discount }) => {
          const currentInvoice = invoices.find((invoice) => Number(invoice.id) === id);
          if (!currentInvoice) throw new Error('Error al cobrar las cuotas');
          return {
            receiptId: receipt.id,
            invoiceId: id,
            description:
              month === 1
                ? description
                : `${description} - ${getMonthName(month)} ${year} ${discount ? `(${formatPercentage(discount)})` : ''}`,
            amount: currentInvoice.amount
          };
        })
      });
      await Promise.all(mappedAdditionals.map((additional) => tx.additional.create({ data: additional })));
      return receipt;
    });

    revalidatePath(`/students/${studentId}`);

    return {
      error: false,
      message: 'Recibo creado con éxito',
      receipt
    };
  } catch (e) {
    return {
      error: true,
      message: getErrorMessage(e),
      receipt: null
    };
  }
};

export const updateReceipt = async (_: unknown, formData: FormData) => {
  const id = formData.get('id') as string;
  const paymentMethod = formData.get('paymentMethod') as ReceiptPaymentMethod;

  try {
    const updatedReceipt = await prisma.receipt.update({
      where: { id: Number(id) },
      data: { paymentMethod }
    });

    revalidatePath(`/students/${updatedReceipt.studentId}`);

    return { error: false, message: 'Recibo actualizado con éxito', receipt: updatedReceipt };
  } catch (e) {
    return {
      error: true,
      message: getErrorMessage(e),
      receipt: null
    };
  }
};
