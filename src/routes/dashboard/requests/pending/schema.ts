import { formatEthiopianYear } from '$lib/global.svelte';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';

import { z } from 'zod/v4';

export const penality = z.object({});

export type AddPen = z.infer<typeof penality>;

export const add = z.object({
	id: z.number('Request Id is required'),
	approvedBy: z.number('Approved by is required').optional(),
	rejectedReason: z.string('Rejected reason is required').optional(),
	status: z.enum(['rejected', 'approved'], 'Status is required').default('approved')
});

export type AddRequest = z.infer<typeof add>;
