'use server';

import prisma from './prisma';
import { enrollmentFormSchema } from './validations/form';

export const getEnrollments = async (sortOrder: 'asc' | 'desc' = 'asc') => {
  return prisma.enrollment.findMany({
    orderBy: {
      year: sortOrder
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

export const editEnrollment = async (_: unknown, editedEnrollment: FormData) => {
  const parsedData = enrollmentFormSchema.safeParse({
    amount: editedEnrollment.get('amount'),
    id: Number(editedEnrollment.get('id'))
  });

  if (!parsedData?.success) {
    return {
      error: true,
      message: 'Error al editar la matrícula'
    };
  }

  try {
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: parsedData.data.id
      },
      data: {
        amount: Number(parsedData.data.amount)
      }
    });

    return {
      error: false,
      message: `Matrícula ${updatedEnrollment.year} actualizada con éxito`
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: 'Error al actualizar la matrícula'
    };
  }
};
