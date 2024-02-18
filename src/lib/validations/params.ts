import { z } from 'zod';

export const studentListSearchParamsSchema = z.object({
    page: z.string().default('1'),
    size: z.string().default('10'),
    sortBy: z.string().default('lastName'),
    sortOrder: z.string().default('asc'),
    studentByCourse: z.string().optional(),
    lastName: z.string().optional()
});
