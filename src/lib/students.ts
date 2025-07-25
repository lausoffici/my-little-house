'use server';

import { InvoiceState } from '@prisma/client';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { formatCurrency, getMonthName, getPaginationClause } from './utils';
import { getDiscountedAmount } from './utils/invoices.utils';
import { discountsFormSchema, studentFormSchema } from './validations/form';
import { studentInvoiceListSearchParamsSchema, studentListSearchParamsSchema } from './validations/params';

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
  const { page, size, sortBy, sortOrder, studentByCourse, lastName, withInactiveStudents } =
    studentListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  // Get the course IDs from the search params
  const courseIds = studentByCourse?.split('.').map(Number) ?? [];

  const whereClause = {
    active: withInactiveStudents ? undefined : true,
    studentByCourse: courseIds.length > 0 ? { some: { courseId: { in: courseIds } } } : undefined,
    firstName: {
      not: ''
    },
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

  const pagination = getPaginationClause(pageNumber, pageSize);

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      studentByCourse: {
        include: {
          course: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    ...pagination
  });

  return { data: students, totalPages, totalItems: totalStudentsCount };
};

export const createStudent = async (_: unknown, createdStudent: FormData) => {
  const birthDate = createdStudent.get('birthDate');

  const parsedData = studentFormSchema.safeParse({
    firstName: createdStudent.get('firstName'),
    lastName: createdStudent.get('lastName'),
    birthDate: birthDate === '' ? undefined : birthDate,
    dni: createdStudent.get('dni'),
    email: createdStudent.get('email'),
    address: createdStudent.get('address'),
    city: createdStudent.get('city'),
    phone: createdStudent.get('phone'),
    mobilePhone: createdStudent.get('mobilePhone'),
    momPhone: createdStudent.get('momPhone'),
    dadPhone: createdStudent.get('dadPhone'),
    observations: createdStudent.get('observations')
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al crear el estudiante'
    };
  }

  try {
    const student = await prisma.student.create({
      data: {
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        birthDate: parsedData.data.birthDate,
        dni: parsedData.data.dni,
        email: parsedData.data.email,
        address: parsedData.data.address,
        city: parsedData.data.city,
        phone: parsedData.data.phone,
        mobilePhone: parsedData.data.mobilePhone,
        momPhone: parsedData.data.momPhone,
        dadPhone: parsedData.data.dadPhone,
        observations: parsedData.data.observations
      }
    });

    return {
      error: false,
      message: `Estudiante creado extosamente: ${student.firstName} ${student.lastName}`,
      id: student.id
    };
  } catch (e) {
    console.error(e);
    return {
      error: true,
      message: 'Error al crear el estudiante'
    };
  }
};

export const editStudent = async (_: unknown, editedStudent: FormData) => {
  const birthDate = editedStudent.get('birthDate');

  const parsedData = studentFormSchema.safeParse({
    firstName: editedStudent.get('firstName'),
    lastName: editedStudent.get('lastName'),
    birthDate: birthDate === '' ? undefined : birthDate,
    dni: editedStudent.get('dni'),
    email: editedStudent.get('email'),
    address: editedStudent.get('address'),
    city: editedStudent.get('city'),
    phone: editedStudent.get('phone'),
    mobilePhone: editedStudent.get('mobilePhone'),
    momPhone: editedStudent.get('momPhone'),
    dadPhone: editedStudent.get('dadPhone'),
    observations: editedStudent.get('observations'),
    id: editedStudent.get('id')
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al editar el estudiante'
    };
  }

  const studentId = Number(parsedData.data.id);

  try {
    const student = await prisma.student.update({
      where: {
        id: studentId
      },
      include: {
        studentByCourse: true
      },
      data: {
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        birthDate: parsedData.data.birthDate,
        dni: parsedData.data.dni,
        email: parsedData.data.email,
        address: parsedData.data.address,
        city: parsedData.data.city,
        phone: parsedData.data.phone,
        mobilePhone: parsedData.data.mobilePhone,
        momPhone: parsedData.data.momPhone,
        dadPhone: parsedData.data.dadPhone,
        observations: parsedData.data.observations
      }
    });

    return {
      error: false,
      message: `Estudiante editado exitosamente: ${student.firstName} ${student.lastName}`
    };
  } catch (e) {
    console.error(e);
    return {
      error: true,
      message: 'Error al editar el estudiante'
    };
  }
};

export const getStudentNamesByTerm = async (term: string) => {
  const students = await prisma.student.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: term,
            mode: 'insensitive' as const
          },
          active: true
        },
        {
          lastName: {
            contains: term,
            mode: 'insensitive' as const
          },
          active: true
        }
      ]
    },
    select: {
      id: true,
      firstName: true,
      lastName: true
    },
    take: 10
  });

  return students;
};

export const deleteStudent = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    await tx.item.deleteMany({
      where: {
        receipt: {
          studentId: id
        }
      }
    });

    await tx.item.deleteMany({
      where: {
        invoice: {
          studentId: id
        }
      }
    });

    await tx.item.deleteMany({
      where: {
        additional: {
          studentId: id
        }
      }
    });

    await tx.receipt.deleteMany({
      where: { studentId: id }
    });

    await tx.invoice.deleteMany({
      where: { studentId: id }
    });

    await tx.additional.deleteMany({
      where: { studentId: id }
    });

    await tx.studentByCourse.deleteMany({
      where: { studentId: id }
    });
    await tx.studentEnrollment.deleteMany({
      where: { studentId: id }
    });

    return await tx.student.delete({
      where: { id: id }
    });
  });
};

export const inactivateStudent = async (id: number) => {
  return await prisma.student.update({
    where: {
      id
    },
    data: {
      active: false
    }
  });
};

export const activateStudent = async (id: number) => {
  return await prisma.student.update({
    where: {
      id
    },
    data: {
      active: true
    }
  });
};

export const getStudentInvoices = async (id: number, searchParams: SearchParams) => {
  const { page, size, sortBy, sortOrder, showAll } = studentInvoiceListSearchParamsSchema.parse(searchParams);

  const pageNumber = Number(page);
  const pageSize = Number(size);

  const whereClause = {
    studentId: id,
    state: showAll === 'true' ? undefined : InvoiceState.I
  };

  const invoicesCount = await prisma.invoice.count({
    where: whereClause
  });

  const totalPages = Math.ceil(invoicesCount / pageSize);

  const pagination = getPaginationClause(pageNumber, pageSize);

  const invoices = await prisma.invoice.findMany({
    where: whereClause,
    orderBy: {
      [sortBy]: sortOrder
    },
    ...pagination
  });

  return { invoices, totalPages };
};

export const addDiscount = async (_: unknown, discountData: FormData) => {
  const parsedData = discountsFormSchema.safeParse({
    course: discountData.get('course'),
    discount: discountData.get('discount'),
    studentId: discountData.get('studentId'),
    studentByCourseId: discountData.get('studentByCourseId')
  });

  if (!parsedData.success) {
    console.error(parsedData.error.flatten().fieldErrors);
    return {
      error: true,
      message: 'Error al agregar el descuento'
    };
  }

  const courseId = Number(parsedData.data.course);
  const discount = Number(parsedData.data.discount);
  const studentId = Number(parsedData.data.studentId);
  const studentByCourseId = Number(parsedData.data.studentByCourseId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.studentByCourse.update({
        where: {
          id: studentByCourseId
        },
        data: {
          discount
        }
      });

      await tx.invoice.updateMany({
        where: {
          studentId,
          courseId,
          state: InvoiceState.I,
          year: new Date().getFullYear()
        },
        data: {
          discount
        }
      });
    });

    return {
      error: false,
      message: 'Descuento agregado exitosamente'
    };
  } catch (e) {
    console.error(e);
    return {
      error: true,
      message: 'Error al agregar el descuento'
    };
  }
};

export const getStudentSheetData = async () => {
  const students = await prisma.student.findMany({
    where: {
      active: true
    },
    include: {
      studentByCourse: {
        include: {
          course: true
        }
      },
      invoices: true
    },
    orderBy: {
      lastName: 'asc'
    }
  });

  const expiredInvoices = await prisma.invoice.findMany({
    where: {
      state: InvoiceState.I,
      expiredAt: { lt: new Date() },
      student: {
        active: true
      }
    }
  });

  return students.map((item) => {
    const courses = item.studentByCourse.map((c) => c.course);
    const currentDebt = expiredInvoices.filter((i) => i.studentId === item.id);

    return {
      Alumno: `${item.lastName} ${item.firstName}`,
      Curso: courses.map((c) => c.name).join(', '),
      Cuota: courses.map((c) => formatCurrency(c.amount)).join(', '),
      Deuda: currentDebt
        .map(
          (i) => `${getMonthName(i.month)}: ${formatCurrency(getDiscountedAmount(i.amount, i.discount) - i.balance)}`
        )
        .join(', ')
    };
  });
};
