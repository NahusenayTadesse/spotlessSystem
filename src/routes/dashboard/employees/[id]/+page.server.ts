import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import { employee, employeeTermination, employmentStatuses } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from '../$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { terminate } from './schema';

import { saveUploadedFile } from '$lib/server/upload';

export const load: PageServerLoad = async () => {
	const terminateForm = await superValidate(zod4(terminate));
	return { terminateForm };
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
					staffId: id,
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
					.where(eq(employee.id, id));
			});
			setFlash({ type: 'success', message: 'Employee Terminated Successfully!' }, cookies);
		} catch (err) {
			console.error('Error terminating employee:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return message(form, {
				type: 'error',
				text: 'An error occurred while terminating the employee.'
			});
		}
	}
};
