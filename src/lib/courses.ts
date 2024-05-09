'use server';

import { Course, InvoiceState, Prisma } from '@prisma/client';
import { cache } from 'react';

import { InvoiceDataType, Option } from '@/types';

import prisma from './prisma';
import { getTodaysData } from './utils';
import { courseFormSchema, deleteCourseEnrollmentSchema, enrollStudentFormSchema } from './validations/form';

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

export const createCourse = async (_: unknown, newCourse: FormData) => {
  const parsedData = courseFormSchema.safeParse({
    name: newCourse.get('name'),
    amount: newCourse.get('amount'),
    observations: newCourse.get('observations')
  });

  if (!parsedData.success) {
    return {
      error: true,
      message: 'Error al crear curso'
    };
  }

  try {
    const course = await prisma.course.create({
      data: parsedData.data
    });

    return {
      error: false,
      message: `Curso ${course.name} creado con éxito`
    };
  } catch (error) {
    return {
      error: true,
      message: 'Error al crear el curso'
    };
  }
};

export const editCourse = async (_: unknown, editedCourse: FormData) => {
  const parsedData = courseFormSchema.safeParse({
    name: editedCourse.get('name'),
    amount: editedCourse.get('amount'),
    observations: editedCourse.get('observations'),
    id: Number(editedCourse.get('id'))
  });

  if (!parsedData.success) {
    return {
      error: true,
      message: 'Error al editar el curso'
    };
  }

  try {
    const course = await prisma.$transaction(async (tx) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const nextMonth = currentMonth + 1;

      // Update all invoices for the course that are in the future and have not been paid
      await tx.invoice.updateMany({
        where: {
          courseId: parsedData.data.id,
          state: InvoiceState.I,
          month: {
            gte: nextMonth
          },
          year: {
            equals: currentDate.getFullYear()
          }
        },
        data: {
          amount: parsedData.data.amount,
          description: parsedData.data.name
        }
      });

      const updatedCourse = await tx.course.update({
        where: {
          id: parsedData.data.id
        },
        data: parsedData.data
      });

      return updatedCourse;
    });

    return {
      error: false,
      message: `${course.name} editado con éxito`
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: 'Error al editar curso'
    };
  }
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

const generateInvoices = async (tx: Prisma.TransactionClient, course: Course, studentId: number, discount: number) => {
  const todaysData = getTodaysData();
  let currentMonth = todaysData.currentMonth;
  const currentYear = todaysData.currentYear;

  // If the current month is January or February is set to March
  if (currentMonth < 3) currentMonth = 3;

  // Create invoices for every month since current until December

  const invoicesData: InvoiceDataType[] = [];

  for (let i = currentMonth; i < 13; i++) {
    invoicesData.push({
      month: i,
      year: currentYear,
      description: course.name,
      amount: course.amount,
      balance: 0,
      state: 'I',
      expiredAt: new Date(`${i}-15-${currentYear}`),
      courseId: course.id,
      studentId: studentId,
      discount
    });
  }

  await tx.invoice.createMany({ data: invoicesData });
};

const generateEnrollment = async (tx: Prisma.TransactionClient, studentId: number) => {
  const todaysData = getTodaysData();
  let currentMonth = todaysData.currentMonth;
  const currentYear = todaysData.currentYear;

  const enrollment = await tx.enrollment.findFirst({
    where: {
      year: currentYear
    }
  });

  await tx.studentEnrollment.create({
    data: {
      year: currentYear,
      studentId: studentId
    }
  });

  await tx.invoice.create({
    data: {
      month: 1,
      year: currentYear,
      description: 'Matrícula',
      amount: enrollment?.amount || 0,
      balance: 0,
      state: 'I',
      expiredAt: new Date(`${currentMonth}-15-${currentYear + 1}`),
      courseId: null,
      studentId: studentId
    }
  });
};

export const enrollCourse = async (_: unknown, newCourse: FormData) => {
  const parsedData = enrollStudentFormSchema.safeParse({
    course: newCourse.get('course'),
    discount: newCourse.get('discount'),
    studentId: newCourse.get('studentId')
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al inscribir curso'
    };
  }

  const courseId = Number(parsedData.data.course);
  const discount = Number(parsedData.data.discount);
  const studentId = Number(parsedData.data.studentId);

  const currentYear = getTodaysData().currentYear;

  try {
    const course = await prisma.$transaction(async (tx) => {
      // if there is no enrollment i creat one
      const currentEnrollment = await tx.studentEnrollment.findMany({
        where: {
          studentId: studentId,
          year: currentYear
        }
      });

      if (currentEnrollment.length === 0) {
        await generateEnrollment(tx, studentId);
      }

      // create the invoices per student for the course and add discount

      await tx.studentByCourse.create({
        data: {
          courseId,
          studentId,
          discount
        }
      });

      const currentCourse = await tx.course.findUnique({
        where: {
          id: courseId
        }
      });

      if (!currentCourse) {
        throw new Error('Curso no encontrado');
      }

      await generateInvoices(tx, currentCourse, studentId, discount);

      return currentCourse;
    });

    return {
      error: false,
      message: `Estudiante inscripto a ${course.name} con éxito`
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'Error al inscribir al curso'
    };
  }
};

export const deleteCourseEnrollment = async (_: unknown, deletedCourse: FormData) => {
  const parsedData = deleteCourseEnrollmentSchema.safeParse({
    courseId: deletedCourse.get('courseId'),
    studentId: deletedCourse.get('studentId'),
    studentByCourseId: deletedCourse.get('studentByCourseId')
  });

  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors
    };
  }

  const courseId = Number(parsedData.data.courseId);
  const studentId = Number(parsedData.data.studentId);
  const studentByCourseId = Number(parsedData.data.studentByCourseId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.studentByCourse.delete({
        where: {
          id: studentByCourseId
        }
      });

      await tx.invoice.deleteMany({
        where: {
          courseId,
          studentId,
          state: InvoiceState.I
        }
      });
    });

    return {
      error: false,
      message: `Curso eliminado exitosamente`
    };
  } catch (error) {
    return {
      error: false,
      message: 'Error'
    };
  }
};
