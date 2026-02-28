import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {
	customers,
	transactions,
	site,
	user,
	address,
	subcity,
	customerContacts,
	customerContracts,
	siteContacts,
	siteContracts,
	services
} from '$lib/server/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { subcities, service, customerList, paymentMethods } from '$lib/server/fastData';

import { add, edit } from './schema';
import { saveUploadedFile } from '$lib/server/upload';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params.id;
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));

	const paymentMethodsList = await paymentMethods();

	const paymentHistory = await db
		.select()
		.from(transactions)
		.where(eq(transactions.customerId, params.id))
		.orderBy(desc(transactions.createdAt));

	return {
		form,
		editForm,
		paymentMethods: paymentMethodsList
	};
};
