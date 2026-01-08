import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { supplyItemSchema as schema } from './schema';
import { db } from '$lib/server/db';
import { supplies as inventory } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';
import { suppliers } from '$lib/server/fastData';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	const suppliersList = await suppliers();
	return {
		form,
		suppliersList
	};
};

export const actions: Actions = {
	add: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { name, description, unitOfMeasurement, quantity, supplier, reorderLevel } = form.data;

		try {
			await db.insert(inventory).values({
				name,
				description,
				unitOfMeasure: unitOfMeasurement,
				quantity,
				supplier,
				reorderLevel,
				createdBy: locals?.user?.id
			});

			// Stay on the same page and set a flash message
			return message(form, { type: 'success', text: 'New Supply Successfully Added' });
		} catch (err) {
			return message(form, { type: 'error', text: 'New Supply Failed to Add ' + err?.message });
		}
	}
};
