import { z } from 'zod/v4';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '$lib/zodschemas/appointmentSchema';
import type { paymentMethods } from '$lib/server/db/schema';

/**
 * Zod schema for inserting a new expense record.
 * This corresponds to the 'expenses' table.
 */
export const insertExpenseSchema = z.object({
	expenseDate: z.string().min(1, { message: 'Expense date is required.' }),

	type: z.coerce
		.number('Expense Type is Required')
		.int()
		.positive({ message: 'Type ID must be positive.' }),
	paymentMethod: z.coerce
		.number('Payment Method is Required')
		.int()
		.positive(),

	description: z
		.string()
		.max(255, { message: 'Description cannot exceed 255 characters.' })
		.optional(),

	total: z.coerce
		.number('Amount is Required')
		.positive({ message: 'Total must be a positive number.' }),
	reciept: z
		.instanceof(File, { message: 'A file is required.' })
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		)
});

// To use this schema for a form, you might extract the type:
export type InsertExpenseForm = z.infer<typeof insertExpenseSchema>;
