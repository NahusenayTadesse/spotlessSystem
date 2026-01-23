import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { overtimeSchema as schema } from './schema';

import { db } from '$lib/server/db';
import { overTime } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	return {
		form
	};
};

export const actions: Actions = {
	addOvertime: async ({ request, cookies, params, locals }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);

			return fail(400, { form });
		}

		const { reason, date, amountPerHour, hours } = form.data;

		try {
			await db.insert(overTime).values({
				staffId: Number(id),
				amountPerHour,
				hours,
				total: Number(hours) * Number(amountPerHour),
				reason,
				date,
				createdBy: locals.user?.id,
				branchId: locals.user?.branch
			});

			setFlash({ type: 'success', message: 'Overtime Successuflly Added' }, cookies);
			return message(form, { type: 'success', text: 'Overtime Successuflly Added' });
		} catch (err) {
			setFlash(
				{ type: 'error', message: 'An Error occured while adding Overtime' + err?.message },
				cookies
			);
			return message(form, {
				type: 'error',
				text: 'An Error occured while adding Overtime' + err?.message
			});
		}
	}
};
