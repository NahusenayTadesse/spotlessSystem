import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { sql, eq } from 'drizzle-orm';
import { addLeave as schema } from './schema';
import { db } from '$lib/server/db';
import { employee, leave } from '$lib/server/db/schema/';
import { subcities } from '$lib/server/fastData';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { saveUploadedFile } from '$lib/server/upload';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	const subcityList = await subcities();

	return {
		form,
		subcityList
	};
};

export const actions: Actions = {
	addLeave: async ({ request, locals, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: 'Please check your form.' });
		}
		const { requestDate, startDate, endDate, leavesLetter, reason } = form.data;

		try {
			const newCustomerResult = await db.transaction(async (tx) => {
				if (leavesLetter) {
					const leaveLetterFile = await saveUploadedFile(leavesLetter);
					await tx.insert(leave).values({
						staffId: Number(id),
						requestDate,
						startDate,
						endDate,
						leavesLetter: leaveLetterFile,
						reason
					});
				} else {
					await tx.insert(leave).values({
						staffId: Number(id),
						requestDate,
						startDate,
						endDate,
						reason
					});
				}

				// const start = new Date(startDate);
				// const end = new Date(endDate);

				// const differenceInDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

				// // 2. Insert Customer using the new address ID
				// await tx.update(employee).set({
				// 	leavesLeft: sql`${employee.leavesLeft} - ${differenceInDays}`
				// });
			});

			return message(form, { type: 'success', text: 'Leave added successfully' });
			// Stay on the same page and set a flash message
			// setFlash({ type: 'success', message: 'Customer Successfully Added' }, cookies);
		} catch (err) {
			console.error('Error' + err?.message);

			return message(form, {
				type: 'error',
				text: `Unexpected Errror: ${err?.message}`
			});
		}
	}
};
