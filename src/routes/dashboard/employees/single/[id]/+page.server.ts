import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	employee,
	employeeTermination,
	employmentStatuses,
	address,
	staffFamilies
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import {
	terminate,
	reinstate,
	editIdentity,
	editEmployment,
	editPersonal,
	editAddress,
	editFamily
} from './schema';
import { empStatus, departments, eduLevel, subcities } from '$lib/server/fastData';

import { saveUploadedFile } from '$lib/server/upload';

export const load: PageServerLoad = async () => {
	const terminateForm = await superValidate(zod4(terminate));
	const reinstateForm = await superValidate(zod4(reinstate));
	const identityForm = await superValidate(zod4(editIdentity));
	const employmentForm = await superValidate(zod4(editEmployment));
	const personalForm = await superValidate(zod4(editPersonal));
	const addressForm = await superValidate(zod4(editAddress));
	const familyForm = await superValidate(zod4(editFamily));

	const statusList = await empStatus();
	const departmentList = await departments();
	const educationalLevelList = await eduLevel();
	const subcityList = await subcities();

	return {
		terminateForm,
		reinstateForm,
		statusList,
		identityForm,
		departmentList,
		employmentForm,
		educationalLevelList,
		personalForm,
		addressForm,
		subcityList,
		familyForm
	};
};

export const actions: Actions = {
	editStaff: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { staffId, firstName, lastName, position, phone, email, hiredAt, govId, contract } =
			form.data;

		try {
			const files = await db
				.select({ govtId: employee.govtId, contract: employee.contract })
				.from(employee)
				.where(eq(employee.id, staffId))
				.then((rows) => rows[0]);
			let newGovId: string | null;
			let newContract: string | null;
			if (govId && govId.size > 0) {
				const imageName = await saveUploadedFile(govId);
				delete form.data.govId;
				newGovId = imageName;
			} else {
				newGovId = files.govtId;
			}

			if (contract && contract.size > 0) {
				const contractName = await saveUploadedFile(contract);
				delete form.data.contract;
				newContract = contractName;
			} else {
				newContract = files.contract;
			}

			await db
				.update(employee)
				.set({
					firstName,
					lastName,
					type: position,
					phone,
					email,
					hireDate: new Date(hiredAt),
					govtId: newGovId,
					contract: newContract,
					updatedBy: locals?.user?.id
				})
				.where(eq(employee.id, staffId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Service Updated Successuflly' }, cookies);
			return message(form, { type: 'success', text: 'Staff Member Updated Successfully!' });
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return message(form, {
				type: 'error',
				text: 'An error occurred while updating the staff member. ' + err?.message
			});
		}
	},
	terminate: async ({ params, cookies, request, locals }) => {
		const { id } = params;

		console.log('Connected');

		const form = await superValidate(request, zod4(terminate));
		const { reason, terminationDate, terminationLetter } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Insert the termination record
				const terminationLetterName = await saveUploadedFile(terminationLetter);
				delete form.data.terminationLetter;
				await tx.insert(employeeTermination).values({
					staffId: Number(id),
					reason,
					terminationDate,
					terminationLetter: terminationLetterName,
					createdBy: locals?.user?.id
				});

				// 2. Update the employee status
				//
				//

				const employmentStatus = await db
					.select({
						id: employmentStatuses.id
					})
					.from(employmentStatuses)
					.where(eq(employmentStatuses.terminationStatus, true))
					.then((data) => data[0].id);

				await tx
					.update(employee)
					.set({
						employmentStatus,
						terminationDate: new Date(terminationDate) || null,
						isActive: false,
						updatedBy: locals?.user?.id
					})
					.where(eq(employee.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Employee Terminated Successfully!' });
		} catch (err) {
			console.error('Error terminating employee:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	reinstate: async ({ params, request, locals }) => {
		const { id } = params;

		const form = await superValidate(request, zod4(reinstate));
		const { newStatus } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Insert the termination record

				// await tx.delete(employeeTermination).where(eq(employeeTermination.staffId, Number(id)));

				// 2. Update the employee status
				//
				//

				// const employmentStatus = await db
				// 	.select({
				// 		id: employmentStatuses.id
				// 	})
				// 	.from(employmentStatuses)
				// 	.where(eq(employmentStatuses.terminationStatus, true))
				// 	.then((data) => data[0].id);

				await tx
					.update(employee)
					.set({
						employmentStatus: newStatus,
						terminationDate: null,
						isActive: true,
						updatedBy: locals?.user?.id
					})
					.where(eq(employee.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Employee Reinstated Successfully!' });
		} catch (err) {
			console.error('Error terminating employee:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	editIdentity: async ({ params, request, locals }) => {
		const { id } = params;

		const form = await superValidate(request, zod4(editIdentity));
		const { firstName, fatherName, grandFatherName, gender, birthDate } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(employee)
					.set({
						name: firstName,
						fatherName,
						grandFatherName,
						gender,
						birthDate: new Date(birthDate),
						updatedBy: locals?.user?.id
					})
					.where(eq(employee.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Employee Identity Updated Successfully!' });
		} catch (err) {
			console.error('Error updating employee identity:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	editEmployment: async ({ params, request, locals }) => {
		const { id } = params;

		const form = await superValidate(request, zod4(editEmployment));
		const { idNo, department, educationalLevel, employmentStatus, hireDate } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(employee)
					.set({
						idNo,
						departmentId: department,
						employmentStatus,
						educationalLevel,
						hireDate: new Date(hireDate),
						updatedBy: locals?.user?.id
					})
					.where(eq(employee.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Employment Details Updated Successfully!' });
		} catch (err) {
			console.error('Error updating employment details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	editPersonal: async ({ params, request, locals }) => {
		const { id } = params;

		const form = await superValidate(request, zod4(editPersonal));
		const { tinNo, martialStatus, bloodType, religion } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(employee)
					.set({
						tinNo,
						martialStatus,
						bloodType,
						religion,
						updatedBy: locals?.user?.id
					})
					.where(eq(employee.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Employee Details Updated Successfully!' });
		} catch (err) {
			console.error('Error updating employee details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	editAddress: async ({ request }) => {
		const form = await superValidate(request, zod4(editAddress));
		const { id, street, subcity, kebele, buildingNumber, floor, houseNumber, status } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(address)
					.set({
						subcityId: subcity,
						street,
						kebele,
						buildingNumber,
						floor,
						houseNumber,
						status
					})
					.where(eq(address.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Address Details Updated Successfully!' });
		} catch (err) {
			console.error('Error updating Address details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	editFamily: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(editFamily));
		const {
			id,
			name,
			gender,
			phone,
			email,
			relationShip,
			otherRelationShip,
			emergencyContact,
			status
		} = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(staffFamilies)
					.set({
						name,
						gender,
						phone,
						email,
						relationship: relationShip,
						otherRelationship: otherRelationShip,
						emergencyContact,
						isActive: status,
						updatedBy: locals?.user?.id
					})
					.where(eq(staffFamilies.id, Number(id)));
			});
			return message(form, {
				type: 'success',
				text: 'Family Member Details Updated Successfully!'
			});
		} catch (err) {
			console.error('Error updating Family Member details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	}
};
