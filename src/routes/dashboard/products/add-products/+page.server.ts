import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { inventoryItemSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { products as inventory, productCategories } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const allCategories = await db
		.select({
			value: productCategories.id,
			name: productCategories.name,
			description: productCategories.description
		})
		.from(productCategories);
	const form = await superValidate(zod4(inventoryItemSchema));

	return {
		form,
		allCategories
	};
};

export const actions: Actions = {
	addProduct: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(inventoryItemSchema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return message(form, { type: 'error', text: 'Please check your form data.' });
		}

		const {
			productName,
			category,
			description,
			commission,
			quantity,
			price,
			supplier,
			reorderLevel,
			costPerUnit
		} = form.data;

		try {
			await db.insert(inventory).values({
				name: productName,
				commissionAmount: commission,
				categoryId: category,
				description,
				quantity,
				price,
				supplier,
				reorderLevel,
				cost: costPerUnit,
				branchId: locals?.user?.branch,
				createdBy: locals?.user?.id
			});

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'New Product Successuflly Added' }, cookies);

			return message(form, { type: 'success', text: 'New Product Successfully Added' });
		} catch (err) {
			setFlash(
				{ type: 'error', message: 'An error occurred while adding the product.' + err?.message },
				cookies
			);

			return message(form, {
				type: 'error',
				text: 'An error occurred while adding the product.' + err?.message
			});
		}
	}
};
