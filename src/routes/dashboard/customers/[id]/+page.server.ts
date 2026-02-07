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
import { type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const { id } = params;

		const form = await superValidate(zod4(editCustomer));

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
			.where(eq(customers.id, id))
			.groupBy(
				customers.id,
				user.name,
				site.id,
				customers.createdAt,
				customers.name,
				customers.phone
			)
			.then((rows) => rows[0]);

		const customerAddress = await db
			.select({
				subcity: subcity.name,
				kebele: address.kebele,
				street: address.street,
				buildingNumber: address.buildingNumber,
				floor: address.floor,
				houseNumber: address.houseNumber
			})
			.from(address)
			.leftJoin(customers, eq(customers.address, address.id))
			.leftJoin(subcity, eq(address.subcityId, subcity.id))
			.where(eq(customers.id, Number(id)))
			.then((rows) => rows[0]);

		return {
      customer,
			customerAddress
			form
		};
	} catch (error) {
		console.error('Error loading customer dashboard:', error);
		return {
			customer: null,
			form: null,
			allMethods: [],
			reciepts: [],
			error: 'Failed to load customer dashboard.'
		};
	}
};

export const actions: Actions = {
	editCustomer: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(editCustomer));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form.' }, cookies);
			return fail(400, { form });
		}
		const { firstName, lastName, gender, phone, customerId } = form.data;

		try {
			await db
				.update(customers)
				.set({
					firstName,
					lastName,
					gender: gender === 'male' || gender === 'female' ? gender : undefined,
					phone,
					updatedBy: locals?.user?.id
				})
				.where(eq(customers.id, customerId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Customer updated Successfully Added' }, cookies);
			return message(form, { type: 'success', text: 'Customer updated Successfully Added' });
		} catch (err) {
			console.error('Error' + err);
			setFlash({ type: 'error', message: 'Error: Something Went Wrong Try Again' }, cookies);

			return message(form, { type: 'error', text: 'Error: Something Went Wrong Try Again' });
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
