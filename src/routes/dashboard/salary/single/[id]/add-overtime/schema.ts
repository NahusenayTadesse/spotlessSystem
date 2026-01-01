import { z } from 'zod/v4';


export const overtimeSchema = z.object({
    date: z.string().min(1, { message: 'Deduction date is required.' }),
    

    reason: z
        .string()
        .max(255, { message: 'Description cannot exceed 255 characters.' })
        .optional(),

    amountPerHour: z.coerce
        .number('Amount is Required')
        .positive({ message: 'Amount must be a positive number.' }),
    hours: z.coerce.number('Hours is Required').int().positive(),
});

// To use this schema for a form, you might extract the type:
export type InsertExpenseForm = z.infer<typeof overtimeSchema>;
