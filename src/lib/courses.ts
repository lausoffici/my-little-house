'use server';

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

  return await prisma.course.update({
    where: {
      id
    },
    data: parsedData.data
  });
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
