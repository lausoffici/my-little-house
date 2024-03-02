'use server';

import { InvoiceState } from '@prisma/client';
import { cache } from 'react';

import { Option } from '@/types';

import prisma from './prisma';
import { courseFormSchema } from './validations/form';

export const getActiveCourses = cache(async () => {
  return await prisma.course.findMany({
    where: {
      active: true
    }
  });
});

export const getCourseOptions = cache(async () => {
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
});

export const createCourse = async (newCourse: FormData) => {
  const parsedData = courseFormSchema.safeParse({
    name: newCourse.get('name'),
    amount: newCourse.get('amount'),
    observations: newCourse.get('observations')
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors
    };
  }

  return await prisma.course.create({
    data: parsedData.data
  });
};

export const editCourse = async (id: number, editedCourse: FormData) => {
  const parsedData = courseFormSchema.safeParse({
    name: editedCourse.get('name'),
    amount: editedCourse.get('amount'),
    observations: editedCourse.get('observations')
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors
    };
  }

  const course = await prisma.$transaction(async (tx) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth + 1;

    // Update all invoices for the course that are in the future and have not been paid
    await tx.invoice.updateMany({
      where: {
        courseId: id,
        state: InvoiceState.I,
        AND: [
          {
            month: {
              gte: nextMonth
            }
          },
          {
            month: {
              lte: 12
            }
          },
          {
            year: {
              equals: currentDate.getFullYear()
            }
          }
        ]
      },
      data: {
        amount: parsedData.data.amount,
        description: parsedData.data.name
      }
    });

    return tx.course.update({
      where: {
        id
      },
      data: parsedData.data
    });
  });

  return course;
};

export const deleteCourse = async (id: number) => {
  return await prisma.course.update({
    where: {
      id
    },
    data: {
      active: false
    }
  });
};
