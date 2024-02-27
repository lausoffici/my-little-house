'use server';

import { Prisma } from '@prisma/client';

import { SearchParams } from '@/types';

import prisma from './prisma';
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

    const receipts = await prisma.receipt.findMany({
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
        where: whereClause,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: orderByClause
    });

    return { data: receipts, totalPages };
};

export const getReceiptItemsById = (searchParams: SearchParams) =>
    searchParams.receiptId
        ? prisma.item.findMany({
              where: {
                  receiptId: Number(searchParams.receiptId)
              }
          })
        : null;
