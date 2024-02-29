'use server';

import { Prisma } from '@prisma/client';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { getPaginationClause } from './utils';
import { getYearMonthDayFromSearchParams } from './utils/cash-register.utils';
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

export const getReceiptById = (searchParams: SearchParams) => {
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
