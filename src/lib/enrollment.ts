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

export const getAllActiveStudentsWithEnrollmentStatus = async () => {
  return await prisma.$transaction(async (tx) => {
    const latestEnrollment = await tx.enrollment.findFirst({
      orderBy: { year: 'desc' }
    });

    if (!latestEnrollment) {
      return [];
    }

    const year = latestEnrollment.year;

    // Get ALL active students
    const allStudents = await tx.student.findMany({
      where: { active: true },
      include: {
        studentEnrollments: {
          where: { year }
        },
        invoices: {
          where: {
            year: year,
            description: {
              contains: 'Matrícula',
              mode: 'insensitive'
            }
          },
          include: {
            items: true
          }
        }
      }
    });

    // Map all students with their enrollment status
    const results = allStudents.map((student) => {
      const isEnrolled = student.studentEnrollments.length > 0;
      const invoice = student.invoices[0];

      if (!invoice) {
        return {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          mobilePhone: student.mobilePhone,
          enrollmentYear: year,
          enrollmentAmount: latestEnrollment.amount,
          totalPaid: 0,
          balance: latestEnrollment.amount,
          invoiceState: null,
          paymentStatus: isEnrolled ? ('SIN FACTURA' as const) : ('NO INSCRIPTO' as const),
          invoiceId: null,
          paymentDate: null
        };
      }

      const totalPaid = invoice.items.reduce((sum, item) => sum + item.amount, 0);

      let paymentStatus: 'PAGO COMPLETO' | 'PAGO PARCIAL' | 'NO PAGO' | 'BECADO' | 'SIN FACTURA';

      if (invoice.state === 'B') {
        paymentStatus = 'BECADO';
      } else if (invoice.state === 'P') {
        paymentStatus = 'PAGO COMPLETO';
      } else if (invoice.state === 'I' && invoice.balance < invoice.amount) {
        paymentStatus = 'PAGO PARCIAL';
      } else {
        paymentStatus = 'NO PAGO';
      }

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        mobilePhone: student.mobilePhone,
        enrollmentYear: year,
        enrollmentAmount: invoice.amount,
        totalPaid: totalPaid,
        balance: invoice.balance,
        invoiceState: invoice.state,
        paymentStatus,
        invoiceId: invoice.id,
        paymentDate: invoice.paymentDate
      };
    });

    return results;
  });
};
