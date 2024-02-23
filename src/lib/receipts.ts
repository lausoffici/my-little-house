'use server';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getYearMonthDayFromSearchParams } from './utils/cash-register.utils';
import { receiptsByDateSchema } from './validations/params';

export const getReceiptsByDate = async (searchParams: SearchParams) => {
    const params = receiptsByDateSchema.parse(searchParams);
    const { dayNumber, monthNumber, yearNumber } = getYearMonthDayFromSearchParams(params);

    const startDate = new Date(yearNumber, monthNumber - 1, dayNumber);
    const endDate = new Date(yearNumber, monthNumber - 1, dayNumber + 1);

    return await prisma.receipt.findMany({
        select: {
            id: true,
            total: true,
            createdAt: true,
            items: true,
            student: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        }
    });
};
