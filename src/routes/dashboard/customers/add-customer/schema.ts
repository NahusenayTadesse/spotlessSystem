import { z } from 'zod/v4';

export const customerSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.email().optional(),
	phone: z.string().min(2).max(100),
	date: z.string().min(2).max(100),
	address: z.string().min(2).max(100),
	city: z.string().min(2).max(100),
	zip: z.string().min(2).max(100),
	subcity: z.string().min(2).max(100),
	region: z.string().min(2).max(100)
});
