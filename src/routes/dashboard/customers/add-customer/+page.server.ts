import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { customerSchema as schema } from './schema';
import { db } from '$lib/server/db';
import { customers } from '$lib/server/db/schema/';
import { cities, regions, subcities } from '$lib/server/fastData';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	const cityList = await cities();
	const regionList = await regions();
	const subcityList = await subcities();

	return {
		form,
		cityList,
		regionList,
		subcityList
	};
};

export const actions: Actions = {
	addCustomer: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form.' }, cookies);
			return fail(400, { form });
		}
		const { firstName, lastName, gender, phone } = form.data;

		try {
			await db.insert(customers).values({
				firstName,
				lastName,
				gender: gender === 'male' || gender === 'female' ? gender : undefined,
				phone,
				createdBy: locals?.user?.id
			});

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Customer Successfully Added' }, cookies);
			return {
				form
			};
		} catch (err) {
			console.error('Error' + err);
			setFlash(
				{
					type: 'error',
					message:
						err.code === 'ER_DUP_ENTRY'
							? 'Phone number is already taken. Please choose another one.'
							: err.message
				},
				cookies
			);

			if (err.code === 'ER_DUP_ENTRY')
				return setError(form, 'phone', 'Phone Number already exists.');

			return fail(400, {
				form
			});
		}
	}
};
