import { z } from 'zod/v4';

export const customerSchema = z.object({
	name: z
		.string('Name is Required')
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be at most 100 characters'),
	email: z.email('Email is Required').optional(),
	phone: z
		.string('Phone Number is Required')
		.min(2, 'Phone must be at least 2 characters')
		.max(100, 'Phone must be at most 100 characters'),
	tinNo: z.coerce
		.string('Tin Number is Required')
		.min(10, 'Tin Number must be exactly 10 numbers')
		.max(10, 'Tin Number must be exactly 10 numbers'),
	street: z
		.string('Street is Required')
		.min(2, 'Street must be at least 2 characters')
		.max(100, 'Street must be at most 100 characters'),
	subcity: z.coerce
		.number('Subcity is Required')
		.min(2, 'Subcity must be at least 2 characters')
		.max(100, 'Subcity must be at most 100 characters'),
	floor: z.coerce.number().optional(),
	kebele: z.string().optional(),
	buildingNumber: z.string().optional(),
	houseNumber: z.coerce.number().optional()
});
