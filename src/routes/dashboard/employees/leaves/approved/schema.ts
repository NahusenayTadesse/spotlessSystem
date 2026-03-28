import { z } from 'zod/v4';

export const approveLeave = z.object({
	ids: z.array(z.number('No Employee Selected')),
	status: z.enum(['pending', 'rejected'])
});
export type ApproveLeave = z.infer<typeof approveLeave>;

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';

export const editLeave = z.object({
	id: z.number('No Leave Selected'),
	requestDate: z.string('Request Date is Required'),
	startDate: z.string('Start Date is Required'),
	endDate: z.string('End Date is Required'),
	reason: z.string('Reason is Required'),
	rejectionReason: z.string().optional(),
	leaveLetter: z
		.instanceof(File, {
			message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		})
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		)
		.optional(),
	status: z.enum(['approved', 'pending', 'rejected'])
});

export type EditLeave = z.infer<typeof editLeave>;
