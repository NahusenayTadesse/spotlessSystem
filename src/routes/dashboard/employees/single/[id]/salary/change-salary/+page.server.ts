import { superValidate, message, setError } from 'sveltekit-superforms';
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
			housingAllowance,
			date
		} = form.data;

		try {
			let errorMessage;
			await db.transaction(async (tx) => {
				const today = new Date(date);
				const yesterday = new Date(today);
				yesterday.setDate(today.getDate() - 1);

				function isThirtyDaysOlder(date) {
					const targetDate = new Date(date);
					const today = new Date();

					// Create a cutoff date by subtracting 30 days from today
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(today.getDate() - 30);

					// Compare the target date to the cutoff
					// If targetDate is <= thirtyDaysAgo, it's at least 30 days old
					return targetDate <= thirtyDaysAgo;
				}

				if (isThirtyDaysOlder(date)) {
					setError(form, 'date', 'Date must be 30 days old or sooner');
					errorMessage = message(form, {
						type: 'error',
						text: 'Date must be 30 days old or sooner'
					});
				}

				await tx
					.update(salaries)
					.set({
						endDate: yesterday,
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
					startDate: today,
					createdBy: locals.user?.id
				});
			});
			if (errorMessage) return errorMessage;
			setFlash({ type: 'success', message: 'New Salary Successuflly Changed' }, cookies);
			return message(form, { type: 'success', text: 'New Salary Successfully Changed' });
		} catch (err) {
			setFlash(
				{ type: 'error', message: 'An Error occured while changing Salary' + err.message },
				cookies
			);

			console.error(err);

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
