'use server';

import { CashRegisterIncomingItem, SearchParams } from '@/types';

import prisma from './prisma';
import { formatCurrency } from './utils';
import { incomingListSearchParamsSchema } from './validations/params';

export const getIncomingsList = async (searchParams: SearchParams) => {
    const { page, size, sortBy, sortOrder } = incomingListSearchParamsSchema.parse(searchParams);

    const pageNumber = Number(page);
    const pageSize = Number(size);

    const whereClause = {};

    // Get the total count of students
    const totalItems = await prisma.item.count({
        where: whereClause
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    const items = await prisma.item.findMany({
        where: whereClause,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            description: true,
            amount: true,
            receipt: {
                select: {
                    id: true,
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });

    // Transform the items to the desired structure
    const transformedItems: CashRegisterIncomingItem[] = items.map((item) => {
        const { receipt, ...itemData } = item;
        const { student } = receipt;
        return {
            ...itemData,
            receiptId: receipt.id,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`
        };
    });

    return { data: transformedItems, totalPages };
};

export const setCashRegisterBalance = async (_: any, formData: FormData) => {
    const balance = Number(formData.get('balance'));
    const date = new Date(formData.get('date') as string);
    const id = Number(formData.get('id'));
    const isValidBalance = !Number.isNaN(balance) && balance > 0;

    try {
        if (isValidBalance) {
            await prisma.cashRegisterInitialBalance.upsert({
                where: {
                    id
                },
                update: {
                    balance
                },
                create: {
                    balance,
                    day: date.getDay(),
                    month: date.getMonth(),
                    year: date.getFullYear()
                }
            });
            return { message: `Saldo inicial guardado correctamente: ${formatCurrency(balance)}` };
        }
    } catch (error) {
        return { message: 'Ocurrió un error al guardar el saldo inicial', error: true };
    }
};

export const getCashRegisterBalance = async (date: string) => {
    const balance = await prisma.cashRegisterInitialBalance.findFirst({
        where: {
            day: new Date(date).getDay(),
            month: new Date(date).getMonth(),
            year: new Date(date).getFullYear()
        }
    });
    return balance;
};
