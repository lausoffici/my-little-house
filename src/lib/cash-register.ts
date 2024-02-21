'use server';

import { CashRegisterIncomingItem, SearchParams } from '@/types';

import prisma from './prisma';
import { formatCurrency } from './utils';
import { getCashRegisterBalanceSearchParamsSchema, incomingListSearchParamsSchema } from './validations/params';

// If not date is provided, it will use the current date
export const getIncomingsListByDate = async (searchParams: SearchParams) => {
    const { day, month, year } = incomingListSearchParamsSchema.parse(searchParams);

    const yearNumber = Number(year) || new Date().getFullYear();
    const monthNumber = Number(month) || new Date().getMonth() + 1;
    const dayNumber = Number(day) || new Date().getDate();

    const startDate = new Date(yearNumber, monthNumber - 1, dayNumber);
    const endDate = new Date(yearNumber, monthNumber - 1, dayNumber + 1);

    const whereClause = {
        receipt: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        }
    };

    // Get the total amount of the items with sum
    const totalAmount = await prisma.item.aggregate({
        _sum: {
            amount: true
        },
        where: whereClause
    });

    const items = await prisma.item.findMany({
        where: whereClause,
        select: {
            id: true,
            description: true,
            amount: true,
            receipt: {
                select: {
                    id: true,
                    createdAt: true,
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
            studentName: `${student.firstName} ${student.lastName}`,
            createdAt: receipt.createdAt
        };
    });

    return { data: transformedItems, totalAmount: totalAmount?._sum?.amount ?? 0 };
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
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                }
            });
            return { message: `Saldo inicial guardado correctamente: ${formatCurrency(balance)}`, error: false };
        }
    } catch (error) {
        console.error(error);
        return { message: 'Ocurrió un error al guardar el saldo inicial', error: true };
    }
};

export const getCashRegisterBalance = async (searchParams: SearchParams) => {
    const { day, month, year } = getCashRegisterBalanceSearchParamsSchema.parse(searchParams);

    const yearNumber = Number(year) || new Date().getFullYear();
    const monthNumber = Number(month) || new Date().getMonth() + 1;
    const dayNumber = Number(day) || new Date().getDate();

    const balance = await prisma.cashRegisterInitialBalance.findFirst({
        where: {
            day: dayNumber,
            month: monthNumber,
            year: yearNumber
        }
    });

    return balance;
};

// If not date is provided, it will use the current date
export const getExpendituresByDate = async (searchParams: SearchParams) => {
    const { day, month, year } = incomingListSearchParamsSchema.parse(searchParams);

    const yearNumber = Number(year) || new Date().getFullYear();
    const monthNumber = Number(month) || new Date().getMonth() + 1;
    const dayNumber = Number(day) || new Date().getDate();

    const startDate = new Date(yearNumber, monthNumber - 1, dayNumber);
    const endDate = new Date(yearNumber, monthNumber - 1, dayNumber + 1);

    const whereClause = {
        createdAt: {
            gte: startDate,
            lt: endDate
        }
    };

    // Get the total amount of the items with sum
    const totalAmount = await prisma.expenditure.aggregate({
        _sum: {
            amount: true
        },
        where: whereClause
    });

    const items = await prisma.expenditure.findMany({
        where: whereClause,
        select: {
            id: true,
            description: true,
            amount: true,
            createdAt: true
        }
    });

    return { data: items, totalAmount: totalAmount?._sum?.amount ?? 0 };
};
