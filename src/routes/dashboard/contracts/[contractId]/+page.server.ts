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
	services,
	siteMonthlyPayments,
	vatAndWithHold
} from '$lib/server/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';

import { paymentMethods } from '$lib/server/fastData';

import { add, edit } from './schema';
import { saveUploadedFile } from '$lib/server/upload';

export const load: PageServerLoad = async ({ params }) => {
	const form = await superValidate(zod4(add));
	const editForm = await superValidate(zod4(edit));
	const { contractId } = params;

	const siteName = await db
		.select({
			name: site.name,
			monthlyAmount: siteContracts.monthlyAmount
		})
		.from(siteContracts)
		.leftJoin(site, eq(siteContracts.siteId, site.id))
		.where(eq(siteContracts.id, Number(contractId)))
		.then((result) => result[0]);

	const vats = await db
		.select()
		.from(vatAndWithHold)
		.then((rows) => rows[0]);
	const paymentMethodsList = await paymentMethods();

	return {
		form,
		siteName,
		editForm,
		vats,
		paymentMethods: paymentMethodsList
	};
};

export const actions: Actions = {
	add: async ({ request, locals, params }) => {
		const { contractId } = params;
		const form = await superValidate(request, zod4(add));

		console.log(form);

		// 2. Check for validation errors (size, mime-type, required fields)
		if (!form.valid) {
			return message(form, {
				type: 'error',
				text: 'Validation failed. Please check the highlighted fields.'
			});
		}

		try {
			// 3. Destructure ALL fields from form.data
			const {
				paymentRequestFile,
				penaltyAmount,
				fsNumber,
				invoiceNumber,
				requestAmount,
				paymentAmount,
				paymentMethod,
				beforeVat,
				vat,
				withholdAmount,
				withholdFile,
				withholdInvoiceNumber,
				receiptFile,
				month,
				date
			} = form.data;

			const result = await db.transaction(async (tx) => {
				const paymentRequestFileUrl = await saveUploadedFile(paymentRequestFile);
				const withholdFileUrl = await saveUploadedFile(withholdFile);
				const receiptFileUrl = await saveUploadedFile(receiptFile);

				const [monthName, year] = month.split('_');

				const [transactionId] = await tx
					.insert(transactions)
					.values({
						recieptLink: receiptFileUrl,
						amount: paymentAmount,
						paymentMethodId: paymentMethod,
						createdBy: locals?.user?.id
					})
					.$returningId();

				await tx.insert(siteMonthlyPayments).values({
					contractId: Number(contractId),
					paymentRequestFile: paymentRequestFileUrl,
					penaltyAmount,
					fsNumber,
					invoiceNumber,
					requestAmount,
					paymentAmount,
					beforeVat,
					vat,
					withholdAmount,
					withholdFile: withholdFileUrl,
					withholdInvoiceNumber,
					month: monthName,
					year: Number(year),
					date,
					transactionId: transactionId.id,
					createdBy: locals?.user?.id
				});

				return { success: true };
			});

			// 7. Success Response
			return message(form, {
				type: 'success',
				text: `Payment recorded successfully!`
			});
		} catch (err) {
			console.error('Server Action Error:', err);

			// Handle potential database errors (unique constraint, etc.)
			return message(
				form,
				{
					type: 'error',
					text: 'A database error occurred. Please try again.'
				},
				{
					status: 500
				}
			);
		}
	}
};
