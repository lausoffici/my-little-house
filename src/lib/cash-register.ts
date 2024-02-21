import { SearchParams } from '@/types';

import prisma from './prisma';
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
                    total: true,
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

    return { data: items, totalPages };
};
