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
