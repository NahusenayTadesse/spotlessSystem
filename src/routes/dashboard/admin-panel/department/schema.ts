import type { Description } from '$lib/components/ui/sheet';
import { z } from 'zod/v4';

export const add = z.object({
	name: z.string('Name of Payment Method is required').min(2).max(50),
	phone: z.string('Phone is required').min(10).max(15).optional(),
	location: z.string('Location is required').min(2).max(100).optional(),
	description: z.string('Description is required').min(2).max(100),
	status: z.boolean('Status is required')
});

export const edit = z.object({
	id: z.coerce.string(),
	name: z.string('Name of Payment Method is required').min(2).max(50),
	phone: z.string('Phone is required').min(10).max(15).optional(),
	location: z.string('Location is required').min(2).max(100).optional(),
	description: z.string('Description is required').min(2).max(100),
	status: z.boolean('Status is required')
});
export type Edit = z.infer<typeof edit>;
