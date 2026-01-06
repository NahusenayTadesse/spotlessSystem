import { setError, superValidate, message, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

import { add, edit } from './schema';
import { db } from '$lib/server/db';
import { city, region } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { regions } from '$lib/server/fastData';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));

	const allData = await db
		.select({
			id: city.id,
			name: city.name,
			region: region.name,
			regionId: city.regionId,
			status: city.status
		})
		.from(city)
		.leftJoin(region, eq(region.id, city.regionId));

	const regionList = await regions();

	return {
		form,
		editForm,
		allData,
		regionList
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for Errors' });
		}

		const { name, regionId, status } = form.data;

		try {
			await db.insert(city).values({
				name,
				regionId: Number(regionId),
				status
			});

			return message(form, { type: 'success', text: 'City Successfully Added' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') setError(form, 'name', 'City already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'City is already exists. Please choose another one.'
						: err.message
			});
		}
	},
	edit: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(edit));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, name, regionId, status } = form.data;

		try {
			await db
				.update(city)
				.set({ name, regionId: Number(regionId), status })
				.where(eq(city.id, id));
			return message(form, { type: 'success', text: 'City Successfully Updated' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') return setError(form, 'name', 'City already exists.');
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'City is already taken. Please choose another one.'
						: err.message
			});
		}
	}
};
