import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { salaryChangeSchema as schema } from './schema';

import { db } from '$lib/server/db';
import { overTime, salaries } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { and, eq, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	return {
		form
	};
};

export const actions: Actions = {
	changeSalary: async ({ request, cookies, params, locals }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);

			return fail(400, { form });
		}

		const {
			amount,
			transportationAllowance,
			nonTaxAllowance,
			positionAllowance,
			housingAllowance
		} = form.data;

		try {
			await db.transaction(async (tx) => {
				const today = new Date();
				const tommorow = new Date(today);
				tommorow.setDate(today.getDate() + 1);
				await tx
					.update(salaries)
					.set({
						endDate: new Date(),
						updatedBy: locals.user?.id
					})
					.where(and(eq(salaries.id, isNull(salaries.endDate)), eq(salaries.staffId, Number(id))));

				await tx.insert(salaries).values({
					staffId: Number(id),
					amount,
					transportationAllowance,
					nonTaxAllowance,
					positionAllowance,
					housingAllowance,
					startDate: tommorow,
					createdBy: locals.user?.id
				});
			});
			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'New Salary Successuflly Changed' }, cookies);
			return message(form, { type: 'success', text: 'New Salary Successfully Changed' });
		} catch (err) {
			setFlash(
				{ type: 'error', message: 'An Error occured while changing Salary' + err.message },
				cookies
			);

			return message(
				form,
				{
					type: 'error',
					text: 'An Error occured while changing Salary' + err.message
				},
				{
					status: 500
				}
			);
		}
	}
};
