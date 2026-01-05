import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { paymentMethod as schema, editPaymentMethod as editSchema } from './schema';
import { db } from '$lib/server/db';
import { paymentMethods, user } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	const editForm = await superValidate(zod4(editSchema));

	const allPaymentMethods = await db
		.select({
			id: paymentMethods.id,
			name: paymentMethods.name,
			createdBy: user.name,
			createdById: paymentMethods.createdBy
		})
		.from(paymentMethods)
		.leftJoin(user, eq(user.id, paymentMethods.createdBy));

	return {
		form,
		editForm,
		allPaymentMethods
	};
};

import { setFlash } from 'sveltekit-flash-message/server';

export const actions: Actions = {
	add: async ({ request, cookies, locals }) => {
		console.log('connected');
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, {
				form
			});
		}

		const { name } = form.data;

		try {
			await db.insert(paymentMethods).values({
				name,
				createdBy: locals.user?.id
			});

			// setFlash({ type: 'success', message: 'Payment Method Successfully Created' }, cookies);
			return message(form, { type: 'success', text: 'Payment Method Successfully Created' });
		} catch (err: any) {
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Payment Method is already taken. Please choose another one.'
						: err.message
			});
			if (err.code === 'ER_DUP_ENTRY')
				return setError(form, 'name', 'Payment Method already exists.');

			return fail(400, {
				form
			});
		}
	}
};

// function generateUserId() {
//     // ID with 120 bits of entropy, or about the same as UUID v4.
//     const bytes = crypto.getRandomValues(new Uint8Array(15));
//     const id = encodeBase32LowerCase(bytes);
//     return id;
// }

// function extractUsername(email: string) {
//   if (typeof email !== "string") {
//     throw new Error("Input must be a string");
//   }

//   // Find the part before the '@'
//   const atIndex = email.indexOf("@");

//   if (atIndex === -1) {
//     throw new Error("Invalid email address: missing '@'");
//   }

//   return email.substring(0, atIndex);
// }
