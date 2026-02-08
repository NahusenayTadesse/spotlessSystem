import { z } from 'zod/v4';

export const editDetail = z.object({
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
		.max(10, 'Tin Number must be exactly 10 numbers')
});
export type EditDetail = z.infer<typeof editDetail>;

export const editAddress = z.object({
	id: z.number('Address Id not found'),
	subcity: z.number('Subsity is required'),
	street: z.string('Street is required'),
	kebele: z.string('Kebele is required'),
	buildingNumber: z.string().optional(),
	floor: z.string().optional(),
	houseNumber: z.string('House Number is Required'),
	status: z.boolean('Status is required')
});
export type EditAddress = z.infer<typeof editAddress>;
