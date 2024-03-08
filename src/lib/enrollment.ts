'use server';

import prisma from './prisma';
import { enrollmentFormSchema } from './validations/form';

export const getEnrollments = async () => {
  return prisma.enrollment.findMany({
    orderBy: {
      year: 'asc'
    }
  });
};

export const addEnrollment = async (_: unknown, newEnrollment: FormData) => {
  const parsedData = enrollmentFormSchema.safeParse({
    year: newEnrollment.get('year'),
    amount: newEnrollment.get('amount')
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al crear la matrícula'
    };
  }

  try {
    const cretedEnrollments = await getEnrollments();

    const enrollmentExists = cretedEnrollments.find((enrollment) => enrollment.year === Number(parsedData.data.year));

    if (enrollmentExists) {
      throw new Error(`La matrícula del año ${parsedData.data.year} ya fue creada`);
    }

    const newEnrollment = await prisma.enrollment.create({
      data: {
        year: Number(parsedData.data.year),
        amount: Number(parsedData.data.amount)
      }
    });

    return {
      message: `Matrícula ${newEnrollment.year} creada con éxito`,
      error: false
    };
  } catch (error: any) {
    return {
      message: error.message,
      error: true
    };
  }
};
