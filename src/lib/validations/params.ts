import { z } from 'zod';

export const studentListSearchParamsSchema = z.object({
    page: z.string().default('1'),
    size: z.string().default('10'),
    sortBy: z.string().default('lastName'),
    sortOrder: z.string().default('asc'),
    studentByCourse: z.string().optional(),
    lastName: z.string().optional()
});

export const incomingListSearchParamsSchema = z.object({
    page: z.string().default('1'),
    size: z.string().default('10'),
    sortBy: z.string().default('description'),
    sortOrder: z.string().default('asc'),
    day: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional()
});

export const studentNamesListQueryParamsSchema = z.string();

export const getCashRegisterBalanceSearchParamsSchema = z.object({
    day: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional()
});
