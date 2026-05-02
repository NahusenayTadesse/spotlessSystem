import { formatEthiopianYear } from '$lib/global.svelte';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';
import { rejects } from 'assert/strict';

import { z } from 'zod/v4';

export const penality = z.object({});

export type AddPen = z.infer<typeof penality>;

export const add = z.object({
	id: z.number('Request Id is required'),
	penality: z.number('Request Id is required'),
	requestedBy: z.number('Requestor is required'),
	month: z.string('Month is required'),
	requestDate: z.string('Request date is required'),
	rejectedReason: z.string('Rejected reason is required').optional(),
	status: z.enum(['pending'], 'Status is required').default('pending')
});

export type AddRequest = z.infer<typeof add>;
