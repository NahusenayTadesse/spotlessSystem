import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { serviceSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { services, serviceCategories } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(serviceSchema));
	const categories = await db
		.select({
			value: serviceCategories.id,
			name: serviceCategories.name,
			description: serviceCategories.description
		})
		.from(serviceCategories);

	return {
		form,
		categories
	};
};

export const actions: Actions = {
	addProduct: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(serviceSchema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, {
				form
			});
		}

		const { serviceName, category, description, durationMinutes, price } = form.data;

		try {
			await db
				.insert(services)
				.values({ serviceName, categoryId: category, description, durationMinutes, price });
			setFlash({ type: 'success', message: 'Service added successfully.' }, cookies);
			return message(form, { type: 'success', text: 'Service added successfully' });
		} catch (err) {
			setFlash(
				{ type: 'error', message: 'An error occurred while adding the service. ' + err?.message },
				cookies
			);
			return message(form, {
				type: 'error',
				text: 'An error occurred while adding the service. ' + err?.message
			});
		}
	}
};
