import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editService as schema } from '$lib/ZodSchema';

import { db } from '$lib/server/db';
import {
	services,
	serviceCategories,
	transactionServices,
	transactions,
	user
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const service = await db
		.select({
			id: services.id,
			name: services.name,
			price: services.price,
			description: services.description,
			category: serviceCategories.name,
			categoryId: serviceCategories.id,
			commission: services.commissionAmount,
			duration: services.durationMinutes,
			saleCount: sql<number>`SUM(${transactionServices.price})`,
			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${services.createdAt}, '%Y-%m-%d')`
		})
		.from(services)
		.leftJoin(serviceCategories, eq(serviceCategories.id, services.categoryId))
		.leftJoin(transactionServices, eq(services.id, transactionServices.serviceId))
		.leftJoin(transactions, eq(transactionServices.transactionId, transactions.id))
		.leftJoin(user, eq(services.createdBy, user.id))
		.where(and(eq(services.branchId, locals?.user?.branch), eq(services.id, id)))
		.groupBy(
			services.id,
			services.name,
			services.price,
			services.description,
			serviceCategories.name,
			services.commissionAmount,
			transactionServices.id
		)
		.then((rows) => rows[0]);

	const categories = await db
		.select({
			value: serviceCategories.id,
			name: serviceCategories.name,
			description: serviceCategories.description
		})
		.from(serviceCategories);

	return {
		service,

		form,
		categories
	};
};

export const actions: Actions = {
	editProduct: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { serviceId, serviceName, category, durationMinutes, description, commission, price } =
			form.data;

		try {
			await db
				.update(services)
				.set({
					name: serviceName,
					commissionAmount: commission.toString(),
					description,
					categoryId: category,
					durationMinutes,
					price: price.toString(),
					updatedBy: locals?.user?.id
				})
				.where(eq(services.id, serviceId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Service Updated Successuflly' }, cookies);
			return message(form, { type: 'success', text: 'Service Updated Successfully!' });
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return message(form, { type: 'error', text: 'Unexpected Error! ' + err?.message });
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(services).where(eq(services.id, id));

			setFlash({ type: 'success', message: 'Service Deleted Successfully!' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
		}
	}
};
