import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import { employee } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { saveUploadedFile } from '$lib/server/upload';

import { currentMonthFilter } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { range } = params;

	const [y1, m1, d1, y2, m2, d2, id] = range.split('-');

	const start = `${y1}-${m1}-${d1}`;
	const end = `${y2}-${m2}-${d2}`;

	return {
		start,
		end
	};
};

//
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
	delete: async ({ cookies, params }) => {
		const { range } = params;

		const id = range.split('-').pop()!;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(employee).where(eq(employee.id, id));

			setFlash({ type: 'success', message: 'Staff Member Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting staff member:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}
};
