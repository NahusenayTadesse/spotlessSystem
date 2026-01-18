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

export const editEmployment = z.object({
	idNo: z.string('ID Number is required'),
	department: z.number('Department is required').nonnegative().positive(),
	hireDate: z.coerce.string('Hired on date is required'),
	employmentStatus: z.number('Employment Status is required'),
	educationalLevel: z.number('Educational Level is required')
});
export type EditEmployment = z.infer<typeof editEmployment>;

export const editPersonal = z.object({
	bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
	tinNo: z.string('Tin Number is required').min(10).max(10),
	martialStatus: z.enum(['single', 'married', 'widowed', 'divorced', 'other']),
	religion: z.string('Religion is required').min(2).max(255)
});
export type EditPersonal = z.infer<typeof editPersonal>;

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

const RelationShipEnum = z.enum(
	[
		'mother',
		'father',
		'spouse',
		'son',
		'daughter',
		'grandchild',
		'grandfather',
		'grandmother',
		'uncle',
		'aunt',
		'brother',
		'sister',
		'other'
	],
	'Relationship is required'
);
export const editFamily = z.object({
	id: z.number('Family Member is not Found'),
	name: z.string('Family member is required').min(1).max(100),
	gender: z.enum(['male', 'female'], 'Gender is required'),
	phone: z.string(),
	email: z.email().optional(),
	emergencyContact: z.boolean().default(false),
	otherRelationShip: z.string().optional(),
	relationShip: RelationShipEnum,
	status: z.boolean().default(true)
});
export type EditFamily = z.infer<typeof editFamily>;
