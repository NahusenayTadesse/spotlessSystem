import { z } from 'zod';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '$lib/zodschemas/appointmentSchema';
export const add = z.object({
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

	bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable().optional(),
	// Ethiopian TIN is exactly 10 digits
	tinNo: z
		.string()
		.regex(/^\d{10}$/, 'TIN must be exactly 10 digits')
		.optional(),

	departmentId: z.number().int().positive('Please select a department'),
	site: z.number().int().positive('Please select a site'),
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
			message: 'New Employee must be at least 18 years old'
		}
	),

	// pensionType: z.coerce.number('Pension ').min(0, 'Pension cannot be negative'),
	// taxType: z.coerce.number('Tax ').min(0, 'Tax type cannot be negative'),
	salary: z.coerce.number('Salary is required ').min(0, 'Salary cannot be negative'),
	positionAllowance: z.coerce
		.number('Positional Allowance is required')
		.min(0, 'Positional Allowance cannot be negative'),
	nonTaxAllowance: z.coerce
		.number('Non Taxable Allowance ')
		.min(0, 'Non Taxable cannot be negative'),
	transportAllowance: z.coerce
		.number('Transport Allowance is required ')
		.min(0, 'Transport Allowance cannot be negative'),
	housingAllowance: z.coerce
		.number('Housing Allowance is required ')
		.min(0, 'Housing Allowance cannot be negative'),
	photo: z
		.instanceof(File, {
			message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		})
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		),
	govtId: z
		.instanceof(File, {
			message: 'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		})
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		),

	hireDate: z.coerce.string('Hired date is required'),

	employmentStatus: z.number('Employment Status ').int().positive('Employment Status is required'),
	educationalLevel: z.coerce
		.number('Educational Level ')
		.int()
		.positive('Educational level is required')
		.nullable()
		.optional(),

	martialStatus: z.enum(['single', 'married', 'widowed', 'divorced', 'other']).default('single'),

	newEmployeeVerified: z.boolean().default(false),
	existingPensionCard: z.boolean().default(false),

	subcity: z.number('Subsity is required'),
	street: z.string('Street is required'),
	kebele: z.string('Kebele is required'),
	buildingNumber: z.string().optional(),
	floor: z.coerce.number().optional(),
	houseNumber: z.string('House Number is Required')
});

// Type inference for TypeScript use
export type InsertEmployee = z.infer<typeof add>;
