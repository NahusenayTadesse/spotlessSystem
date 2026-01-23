import { z } from 'zod/v4';


export const salaryChangeSchema = z.object({
    amount: z.coerce
        .number('New Amount is Required')
        .positive({ message: 'Amount must be a positive number.' }),
});

// To use this schema for a form, you might extract the type:
export type InsertExpenseForm = z.infer<typeof salaryChangeSchema>;
