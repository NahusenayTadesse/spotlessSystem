import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { overtimeSchema as schema } from './schema';

import { db } from '$lib/server/db';
import { overTime, employee } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { overtimeTypes } from '$lib/server/fastData';
import { eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const singleOvertime = await db
		.select({
			name: employee.name,
			reason: overTime.reason,
			date: sql<string>`DATE_FORMAT(${overTime.date}, '%Y-%m-%d')`,
			overtimeType: overTime.overTimeTypeId,
			hours: overTime.hours
		})
		.from(overTime)
		.leftJoin(employee, eq(overTime.staffId, employee.id))
		.where(eq(overTime.id, Number(id)))
		.then((rows) => rows[0]);

	return {
		form,
		overtimeTypes: await overtimeTypes(),
		singleOvertime
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

		const { reason, date, overtimeType, hours } = form.data;

		try {
			await db
				.update(overTime)
				.set({
					overTimeTypeId: overtimeType,
					hours: String(hours),
					total: String(hours),
					reason,
					date: new Date(date),
					updatedBy: locals.user?.id
				})
				.where(eq(overTime.id, Number(id)));

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
