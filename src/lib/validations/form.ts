import { ReceiptPaymentMethod } from '@prisma/client';
import { z } from 'zod';

export const courseFormSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre del curso es requerido'
    })
    .min(3, { message: 'El título debe tener al menos 3 caracteres' })
    .max(50),
  amount: z.coerce
    .number({ required_error: 'El precio del curso es requerido' })
    .positive({ message: 'El precio debe ser mayor a 0' }),
  observations: z.string().nullable()
});

export const studentFormSchema = z.object({
  firstName: z
    .string({
      required_error: 'El nombre es requerido'
    })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50),
  lastName: z
    .string({
      required_error: 'El apellido es requerido'
    })
    .min(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    .max(50),
  birthDate: z.optional(z.string()),
  dni: z.optional(z.string()),
  email: z
    .union([z.string().trim().min(0).max(0), z.string().email({ message: 'El email no es válido' })])
    .optional()
    .transform((e) => e || undefined),
  description: z.optional(z.string()),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  phone: z.optional(z.string()),
  mobilePhone: z.optional(z.string()),
  momPhone: z.optional(z.string()),
  dadPhone: z.optional(z.string()),
  observations: z.optional(z.string()),
  id: z.optional(z.string())
});

export const receiptFormSchema = z.object({
  invoices: z.array(z.any()).optional(),
  additional: z.array(z.any()).optional(),
  studentId: z.string(),
  receiptTotal: z.string(),
  paymentMethod: z.nativeEnum(ReceiptPaymentMethod)
});

export const scholarshipFormSchema = z.object({
  invoiceId: z.number()
});

export const enrollmentFormSchema = z.object({
  year: z.string(),
  amount: z.string()
});

export const discountsFormSchema = z.object({
  course: z.string({ required_error: 'El curso es requerido' }),
  discount: z.string({ required_error: 'El descuento es requerido' }),
  studentId: z.string(),
  studentByCourseId: z.string()
});

export const receiptEmailFormSchema = z.object({
  email: z.string().email({ message: 'El email no es válido' })
});

export const enrollStudentFormSchema = z.object({
  course: z.string({ required_error: 'El curso es requerido' }),
  discount: z.string().optional(),
  studentId: z.string()
});

export const deleteCourseEnrollmentSchema = z.object({
  courseId: z.string(),
  studentId: z.string(),
  studentByCourseId: z.string()
});

export const editInvoiceFormSchema = z.object({
  invoiceId: z.number(),
  amount: z.string({ required_error: 'El importe es requerido' })
});
