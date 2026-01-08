import { z } from 'zod/v4';

export const supplyItemSchema = z.object({
	name: z.string().min(1, { message: 'Product Name is required.' }),

	description: z
		.string()
		.max(500, { message: "Product description can't be more than 500 characters." })
		.optional(),
	quantity: z.coerce
		.number()
		.int({ message: 'Quantity can only be full numbers, no decimals.' })
		.positive({ message: 'Quantity must be a positive number.' }),
	unitOfMeasurement: z.coerce.string(),
	otherUnitOfMeasurement: z.coerce.string().optional(),
	reorderLevel: z.coerce
		.number()
		.int({ message: 'Reorder Level can only be full numbers, no decimals.' })
		.positive({ message: 'Reorder Level must be a positive number.' }),

	supplier: z.string().min(1, { message: 'Supplier is required.' })
});

export type SupplyItemSchema = typeof supplyItemSchema;
