'use server';

import { SearchParams } from '@/types';

import prisma from './prisma';
import { studentFormSchema } from './validations/form';
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

export const createStudent = async (_: unknown, createdStudent: FormData) => {
    const date = createdStudent.get('birthDate');

    const parsedData = studentFormSchema.safeParse({
        firstName: createdStudent.get('firstName'),
        lastName: createdStudent.get('lastName'),
        courses: createdStudent.get('courses'),
        birthDate: date === '' ? undefined : date,
        dni: createdStudent.get('dni'),
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
        // Create the student
        const student = await prisma.student.create({
            data: {
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
                birthDate: parsedData.data.birthDate,
                dni: parsedData.data.dni,
                address: parsedData.data.address,
                city: parsedData.data.city,
                phone: parsedData.data.phone,
                mobilePhone: parsedData.data.mobilePhone,
                momPhone: parsedData.data.momPhone,
                dadPhone: parsedData.data.dadPhone,
                observations: parsedData.data.observations,

                // If the courses string is not empty, create the studentByCourse records
                studentByCourse: {
                    create: parsedData.data.courses
                        ? parsedData.data.courses.split(',').map((id) => ({
                              courseId: Number(id)
                          }))
                        : []
                }
            }
        });

        return {
            error: false,
            message: `Estudiante creado extosamente: ${student.firstName} ${student.lastName}`
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
    const parsedData = studentFormSchema.safeParse({
        firstName: editedStudent.get('firstName'),
        lastName: editedStudent.get('lastName'),
        courses: editedStudent.get('courses'),
        birthDate: editedStudent.get('birthDate'),
        dni: editedStudent.get('dni'),
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
        const student = await prisma.$transaction(async (tx) => {
            const student = await tx.student.update({
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
                    address: parsedData.data.address,
                    city: parsedData.data.city,
                    phone: parsedData.data.phone,
                    mobilePhone: parsedData.data.mobilePhone,
                    momPhone: parsedData.data.momPhone,
                    dadPhone: parsedData.data.dadPhone,
                    observations: parsedData.data.observations
                }
            });

            const currentStudentCoursesId = student.studentByCourse.map(({ courseId }) => courseId).join(',');

            // If the courses string is not empty and it's different from the current courses string, delete the current studentByCourse records and create the new ones
            if (parsedData.data.courses && parsedData.data.courses !== currentStudentCoursesId) {
                await tx.studentByCourse.deleteMany({
                    where: {
                        studentId
                    }
                });

                await tx.studentByCourse.createMany({
                    data: parsedData.data.courses.split(',').map((id) => ({
                        studentId: student.id,
                        courseId: Number(id)
                    }))
                });
            }

            return student;
        });

        return {
            error: false,
            message: `Estudiante editado extosamente: ${student.firstName} ${student.lastName}`
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
                    }
                },
                {
                    lastName: {
                        contains: term,
                        mode: 'insensitive' as const
                    }
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
    return await prisma.student.update({
        where: {
            id
        },
        data: {
            active: false
        }
    });
};

export const getStudentInvoices = async (id: number) => {
    return await prisma.invoice.findMany({
        where: {
            studentId: id
        }
    });
};
