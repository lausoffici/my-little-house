'use server';

import prisma from './prisma';

export const getStudentByFirstName = async (firstName: string) => {
    return await prisma.student.findMany({
        where: {
            studentByCourse: {
                some: {
                    course: {
                        name: 'Children I'
                    }
                }
            }
        }
    });
};

export const getStudentById = async (id: number) => {
    return await prisma.student.findUnique({
        where: {
            id
        }
    });
};
