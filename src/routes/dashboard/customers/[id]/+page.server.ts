import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {
	customers,
	paymentMethods,
	transactions,
	site,
	user,
	address,
	subcity
} from '$lib/server/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { subcities } from '$lib/server/fastData';

import { editDetail, editAddress } from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const detailForm = await superValidate(zod4(editDetail));
	const addressForm = await superValidate(zod4(editAddress));

	const subcityList = await subcities();

	const customer = await db
		.select({
			id: customers.id,
			name: customers.name,
			phone: customers.phone,
			email: customers.email,
			tinNo: customers.tinNo,
			sites: count(site.id),
			joinedOn: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`,
			daysSinceJoined: sql<number>`DATEDIFF(CURRENT_DATE, ${customers.createdAt})`,
			addedBy: user.name,
			addedById: user.id
		})
		.from(customers)
		.leftJoin(user, eq(customers.createdBy, user.id))
		.leftJoin(site, eq(customers.id, site.customerId))
		.where(eq(customers.id, Number(id)))
		.groupBy(customers.id, user.name, site.id, customers.createdAt, customers.name, customers.phone)
		.then((rows) => rows[0]);

	if (!customer) {
		error(404, 'Customer with this id not found');
	}

	const customerAddress = await db
		.select({
			id: address.id,
			street: address.street,
			subcity: subcity.name,
			subcityId: subcity.id,
			kebele: address.kebele,
			buildingNumber: address.buildingNumber,
			floor: address.floor,
			houseNumber: address.houseNumber,
			status: address.status
		})
		.from(address)
		.leftJoin(customers, eq(customers.address, address.id))
		.leftJoin(subcity, eq(address.subcityId, subcity.id))
		.where(eq(customers.id, Number(id)))
		.then((rows) => rows[0]);

	return {
		customer,
		customerAddress,
		detailForm,
		addressForm,
		subcityList
	};
};

export const actions: Actions = {
	editDetail: async ({ request, locals, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(editDetail));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: 'Error: Please Check the form' });
		}
		const { name, phone, tinNo, email } = form.data;

		try {
			await db
				.update(customers)
				.set({
					name,
					phone,
					tinNo,
					email,
					updatedBy: locals?.user?.id
				})
				.where(eq(customers.id, Number(id)));

			// Stay on the same page and set a flash message
			return message(form, { type: 'success', text: 'Customer updated Successfully Added' });
		} catch (err) {
			return message(form, { type: 'error', text: 'Error: Something Went Wrong Try Again' });
		}
	},
	editAddress: async ({ request }) => {
		const form = await superValidate(request, zod4(editAddress));
		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: `Error: check the form` });
		}
		const { id, street, subcity, kebele, buildingNumber, floor, houseNumber, status } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(address)
					.set({
						subcityId: subcity,
						street,
						kebele,
						buildingNumber,
						floor,
						houseNumber,
						status
					})
					.where(eq(address.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Address Details Updated Successfully!' });
		} catch (err) {
			console.error('Error updating Address details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(customers).where(eq(customers.id, id));

			setFlash({ type: 'success', message: 'Customer Deleted Successfully!' }, cookies);
			return message(form, {
				type: 'success',
				text: 'Customer Deleted Successfully!'
			});
		} catch (err) {
			console.error('Error deleting customer:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}
};
