'use server';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { studentListSearchParamsSchema } from './validations/params';

export const getStudentById = async (id: number) => {
    if (isNaN(id)) throw new Error('Invalid student id');

    const student = await prisma.student.findUnique({
        where: {
            id
        },
        include: {
            studentByCourse: {
                include: {
                    course: true
                }
            }
        }
    });

    return student;
};

export const getStudentList = async (searchParams: SearchParams) => {
    const { page, size, sortBy, sortOrder, studentByCourse, lastName } =
        studentListSearchParamsSchema.parse(searchParams);

    const pageNumber = Number(page);
    const pageSize = Number(size);

    // Get the course IDs from the search params
    const courseIds = studentByCourse?.split('.').map(Number) ?? [];

    const whereClause = {
        active: true,
        studentByCourse: courseIds.length > 0 ? { some: { courseId: { in: courseIds } } } : undefined,
        lastName: lastName
            ? {
                  contains: lastName,
                  mode: 'insensitive' as const
              }
            : undefined
    };

    // Get the total count of students
    const totalStudentsCount = await prisma.student.count({
        where: whereClause
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalStudentsCount / pageSize);

    const students = await prisma.student.findMany({
        where: whereClause,
        include: {
            studentByCourse: {
                include: {
                    course: true
                }
            }
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    return { data: students, totalPages };
};
