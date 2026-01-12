import { z } from 'zod';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';
export const add = z.object({
	idNo: z.string().min(1, 'Employee ID is required').max(255),
	name: z.string().min(2, 'Name is too short').max(50),
	fatherName: z.string().min(2, 'Father name is too short').max(50),
	grandFatherName: z.string().min(2, 'Grandfather name is too short').max(50),

	gender: z.enum(['male', 'female'], {
		message: 'Please select a valid gender'
	}),
	phone: z
		.string('Phone is required')
		.min(10, 'Phone number is too short')
		.max(15, 'Phone number is too long'),
	email: z.email().optional(),
	nationality: z.string().max(50).default('Ethiopia'),
	religion: z.string().max(50).default('Christianity'),

	bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable().optional(),
	// Ethiopian TIN is exactly 10 digits
	tinNo: z.string().regex(/^\d{10}$/, 'TIN must be exactly 10 digits'),

	departmentId: z.number().int().positive('Please select a department'),

	birthDate: z.coerce.string('Birth date is required'),

	pensionType: z.coerce.number().min(0, 'Pension cannot be negative'),
	taxType: z.coerce.number().min(0, 'Tax type cannot be negative'),
	salary: z.coerce.number().min(0, 'Salary cannot be negative'),
	// photo: z
	// 	.instanceof(File, {
	// 		message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
	// 	})
	// 	.refine((file) => file.size > 0, 'File cannot be empty.')
	// 	.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
	// 	.refine(
	// 		(file) => ACCEPTED_FILE_TYPES.includes(file.type),
	// 		'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
	// 	),
	// govtId: z
	// 	.instanceof(File, {
	// 		message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
	// 	})
	// 	.refine((file) => file.size > 0, 'File cannot be empty.')
	// 	.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
	// 	.refine(
	// 		(file) => ACCEPTED_FILE_TYPES.includes(file.type),
	// 		'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
	// 	),

	hireDate: z.coerce.string('Hired date is required'),

	employmentStatus: z.coerce.number().int().positive('Employment status is required'),
	educationalLevel: z.coerce
		.number()
		.int()
		.positive('Educational level is required')
		.nullable()
		.optional(),

	martialStatus: z.enum(['single', 'married', 'widowed', 'divorced', 'other']).default('single')
});

// Type inference for TypeScript use
export type InsertEmployee = z.infer<typeof add>;
