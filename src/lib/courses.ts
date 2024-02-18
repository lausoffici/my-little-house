'use server';

import { Option } from '@/types';

import prisma from './prisma';

export const getCourseOptions = async () => {
    const courses = await prisma.course.findMany({
        where: {
            active: true
        },
        select: {
            id: true,
            name: true
        }
    });

    const options: Option[] = courses.map((course) => ({
        value: String(course.id),
        label: course.name
    }));

    return options;
};

export const getActiveCourses = async () => {
    return await prisma.course.findMany({
        where: {
            active: true
        }
    });
};
