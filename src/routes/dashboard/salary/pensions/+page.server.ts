import { setError, superValidate, message, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

import { add, edit } from './schema';
import { db } from '$lib/server/db';
import { taxType, pensionType } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { taxTypes } from '$lib/server/fastData';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));

	const allData = await db
		.select({
			id: pensionType.id,
			name: pensionType.name,
			rate: pensionType.rate,
			taxType: taxType.name,
			status: pensionType.status
		})
		.from(pensionType)
		.leftJoin(taxType, eq(taxType.id, pensionType.taxtype));

	const typeList = await taxTypes();

	return {
		form,
		editForm,
		allData,
		taxTypes: typeList
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for Errors' });
		}

		const { name, rate, status, taxType } = form.data;

		try {
			await db.insert(pensionType).values({
				name,
				rate,
				taxtype: taxType,
				status: status
			});

			return message(form, { type: 'success', text: 'Pension Type Successfully Added' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') setError(form, 'name', 'Pension type already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Pension type is already exists. Please choose another one.'
						: err.message
			});
		}
	},
	edit: async ({ request }) => {
		const form = await superValidate(request, zod4(edit));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, name, rate, taxType, status } = form.data;

		try {
			await db
				.update(pensionType)
				.set({ name, rate, status, taxtype: taxType })
				.where(eq(pensionType.id, id));
			return message(form, { type: 'success', text: 'Pension type Successfully Updated' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') return;
			setError(form, 'name', 'Pension type name already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Pension type name is already taken. Please choose another one.'
						: err.message
			});
		}
	}
};
