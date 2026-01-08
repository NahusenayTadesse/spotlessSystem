import { setError, superValidate, message, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm';

import { add, edit } from './schema';
import { db } from '$lib/server/db';
import { supplySuppliers, supplies, subcity, address } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { subcities, cities } from '$lib/server/fastData';
export const load: PageServerLoad = async ({ params }) => {
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));
	const { id } = params;

	const single = await db
		.select({
			id: supplySuppliers.id,
			name: supplySuppliers.name,
			phone: supplySuppliers.phone,
			email: supplySuppliers.email,
			subcityId: address.subcityId,
			subcity: subcity.name,
			addressId: address.id,
			street: address.street,
			kebele: address.kebele,
			buildingNumber: address.buildingNumber,
			floor: address.floor,
			houseNumber: address.houseNumber,
			description: supplySuppliers.description,
			status: supplySuppliers.status
		})
		.from(supplySuppliers)
		.leftJoin(address, eq(supplySuppliers.address, address.id))
		.leftJoin(subcity, eq(address.subcityId, subcity.id))
		.where(eq(supplySuppliers.id, Number(id)))
		.then((rows) => rows[0]);

	const subcitiesList = await subcities();

	return {
		form,
		editForm,
		single,
		subcitiesList
	};
};

export const actions: Actions = {
	edit: async ({ request, params }) => {
		const form = await superValidate(request, zod4(edit));
		const { id } = params;
		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for Errors' });
		}

		const {
			name,
			addressId,
			subcity,
			email,
			street,
			kebele,
			buildingNumber,
			floor,
			houseNumber,
			phone,
			description,
			status
		} = form.data;

		try {
			await db
				.update(address)
				.set({
					subcityId: Number(subcity),
					street,
					kebele,
					buildingNumber,
					floor,
					houseNumber
				})
				.where(eq(address.id, Number(addressId)));

			await db
				.update(supplySuppliers)
				.set({
					name,
					phone,
					email,
					description,
					status: status
				})
				.where(eq(supplySuppliers.id, id));

			return message(form, { type: 'success', text: 'Supplier Successfully Updated' });
		} catch (err: any) {
			return message(form, {
				type: 'error',
				text: 'Error: ' + err?.message
			});
		}
	}
};
