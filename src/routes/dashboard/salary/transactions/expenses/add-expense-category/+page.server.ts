import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

import { fail } from '@sveltejs/kit';

import { positionSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { expensesType } from '$lib/server/db/schema/';
import type { PageServerLoad, Actions } from './$types.js';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	const allCategories = await db
		.select({
			value: expensesType.id,
			name: expensesType.name,
			description: expensesType.description
		})
		.from(expensesType);

	return {
		form,
		allCategories
	};
};

export const actions: Actions = {
	addExpensesType: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, {
				form
			});
		}

		const { name, description } = form.data;

		try {
			await db.insert(expensesType).values({ name, description });

			setFlash({ type: 'success', message: `Expense Category created successfully!` }, cookies);
			return message(form, { type: 'success', text: 'Expense Category created successfully!' });
		} catch (err: any) {
			setFlash(
				{
					type: 'error',
					message:
						err.code === 'ER_DUP_ENTRY'
							? 'Positions Name is already taken. Please choose another one.'
							: err.message
				},
				cookies
			);

			if (err.code === 'ER_DUP_ENTRY') {
				return setError(form, 'name', 'Category Name already exists.');
				return message(form, { type: 'error', text: 'Category Name already exists.' });
			} else {
				return message(form, { type: 'error', text: err.message });
			}
		}
	}
} satisfies Actions;
