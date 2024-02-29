'use server';

import { Prisma } from '@prisma/client';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getMonthName, getPaginationClause } from './utils';
import { getYearMonthDayFromSearchParams } from './utils/cash-register.utils';
import { invoicesFormSchema } from './validations/form';
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
        select: {
            id: true,
            total: true,
            createdAt: true,
            student: {
                select: {
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
                    firstName: true,
                    lastName: true
                }
            }
        }
    });
};

function combineAdditionals(descriptions: string[], amounts: string[]) {
    if (descriptions.length !== amounts.length) throw new Error('Arrays must have the same length');

    return descriptions.map((description, index) => ({ description, amount: amounts[index] }));
}

export const generateReceipt = async (_: unknown, paidItems: FormData) => {
    const parsedData = invoicesFormSchema.safeParse({
        invoices: paidItems.get('invoices')?.toString().split(','),
        studentId: paidItems.get('studentId'),
        receiptTotal: paidItems.get('receiptTotal'),
        additionalsDescription: paidItems.getAll('additional-description'),
        additionalsAmount: paidItems.getAll('additional-amount')
    });

    if (!parsedData.success) {
        console.error(parsedData.error.flatten().fieldErrors);
        return {
            error: true,
            message: 'Error al cobrar cuotas'
        };
    }

    const { additionalsDescription, additionalsAmount, studentId, receiptTotal } = parsedData.data;

    const additionals = combineAdditionals(additionalsDescription, additionalsAmount);

    try {
        const receipt = await prisma.$transaction(async (tx) => {
            const invoices = await Promise.all(
                parsedData.data.invoices.map((id) =>
                    tx.invoice.update({
                        where: {
                            studentId: Number(studentId),
                            id: Number(id)
                        },
                        data: {
                            state: 'P'
                        }
                    })
                )
            );

            const receipt = await tx.receipt.create({
                data: {
                    studentId: Number(studentId),
                    total: Number(receiptTotal)
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
                data: invoices.map(({ id, description, month, year, amount }) => ({
                    receiptId: receipt.id,
                    invoiceId: id,
                    description: `${description} - ${getMonthName(month)} ${year}`,
                    amount
                }))
            });

            await Promise.all(mappedAdditionals.map((additional) => tx.additional.create({ data: additional })));

            return receipt;
        });

        return {
            error: false,
            message: 'Recibo creado con éxito',
            receipt
        };
    } catch (e) {
        console.log(e);
        return {
            error: true,
            message: 'Error al cobrar cuotas',
            receipt: null
        };
    }
};
