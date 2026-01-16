import { z } from 'zod/v4';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';
import { gender } from '$lib/global.svelte';

export const terminate = z.object({
	reason: z.string().min(2).max(255),
	terminationDate: z.coerce.string('Termination Date is Required'),
	terminationLetter: z
		.instanceof(File, {
			message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		})
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		)
		.optional()
});

export type Terminate = z.infer<typeof terminate>;

export const reinstate = z.object({
	newStatus: z.coerce.number('New Status is Required')
});
export type Reinstate = z.infer<typeof reinstate>;

export const editIdentity = z.object({
	firstName: z.string().min(2).max(255),
	fatherName: z.string().min(2).max(255),
	grandFatherName: z.string().min(2).max(255),
	gender: z.enum(['male', 'female']),
	birthDate: z.coerce.string('Birth date is required').refine(
		(value) => {
			const birth = new Date(value);

			// invalid date guard
			if (isNaN(birth.getTime())) return false;

			const today = new Date();
			let age = today.getFullYear() - birth.getFullYear();
			const m = today.getMonth() - birth.getMonth();

			if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
				age--;
			}

			return age >= 18;
		},
		{
			message: 'You must be at least 18 years old'
		}
	),
	nationality: z.string('Nationality is requried').default('Ethiopia')
});
export type EditIdentity = z.infer<typeof editIdentity>;
