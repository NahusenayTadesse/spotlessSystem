import { setError, superValidate, message, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

import { add, edit } from './schema';
import { db } from '$lib/server/db';
import { subcity, city } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { cities } from '$lib/server/fastData';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));

	const allData = await db
		.select({
			id: subcity.id,
			name: subcity.name,
			city: city.name,
			cityId: city.id,
			status: city.status
		})
		.from(subcity)
		.leftJoin(city, eq(city.id, subcity.cityId));

	const cityList = await cities();

	return {
		form,
		editForm,
		allData,
		cityList
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for Errors' });
		}

		const { name, cityId, status } = form.data;

		try {
			await db.insert(subcity).values({
				name,
				cityId: Number(cityId),
				status
			});

			return message(form, { type: 'success', text: 'Subcity Successfully Added' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') setError(form, 'name', 'Subcity already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Subcity is already exists. Please choose another one.'
						: err.message
			});
		}
	},
	edit: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(edit));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, name, cityId, status } = form.data;

		try {
			await db
				.update(subcity)
				.set({ name, cityId: Number(cityId), status })
				.where(eq(city.id, id));
			return message(form, { type: 'success', text: 'Subity Successfully Updated' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') return setError(form, 'name', 'Subcity already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Subity is already taken. Please choose another one.'
						: err.message
			});
		}
	}
};
