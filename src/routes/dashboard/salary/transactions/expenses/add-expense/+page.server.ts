import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { sql, eq, and } from 'drizzle-orm';
import { insertExpenseSchema as schema } from './expenseSchema';
import { db } from '$lib/server/db';
import {
	expenses,
	expensesType,
	transactions,
	paymentMethods,
	reports
} from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	const categories = await db
		.select({
			value: expensesType.id,
			name: expensesType.name,
			description: expensesType.description
		})
		.from(expensesType);
	const paymentMethod = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name
		})
		.from(paymentMethods);

	return {
		form,
		categories,
		paymentMethod
	};
};
// import fs from 'node:fs';
// import path from 'node:path';
// import { generateUserId } from '$lib/global.svelte';
// import { Readable } from 'node:stream';
// import { pipeline } from 'node:stream/promises';
// import { env } from '$env/dynamic/private';
// import { sql, eq, and } from 'drizzle-orm';

// const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

// if (!fs.existsSync(FILES_DIR)) {
// 	fs.mkdirSync(FILES_DIR, { recursive: true });
// }

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	addExpense: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		console.log(form);

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { expenseDate, total, type, description, paymentMethod, reciept } = form.data;

		try {
			const imageName = await saveUploadedFile(reciept);
			delete form.data.reciept;

			const [transaction] = await db
				.insert(transactions)
				.values({
					amount: total,
					paymentMethodId: paymentMethod,
					recieptLink: imageName,
					paymentStatus: 'paid',
					branchId: locals.user?.branch,
					createdBy: locals.user?.id
				})
				.$returningId();

			await db.insert(expenses).values({
				total,
				transactionId: transaction.id,
				type,
				description,
				expenseDate,
				branchId: locals.user?.branch,
				createdBy: locals.user?.id
			});

			const existingReport = await db
				.select({
					id: reports.id
				})
				.from(reports)
				.where(eq(reports.reportDate, sql`CURDATE()`))
				.then((rows) => rows[0]);

			if (existingReport) {
				await db
					.update(reports)
					.set({
						dailyExpenses: sql`COALESCE(${reports.dailyExpenses}, 0) + ${total}`
					})
					.where(and(eq(reports.id, existingReport.id)));
			} else {
				await db.insert(reports).values({
					reportDate: sql`CURDATE()`,
					dailyExpenses: total
				});
			}

			setFlash({ type: 'success', message: 'Expense Added Successfully' }, cookies);
			return message({ type: 'success', text: 'Expense Added Successfully' });
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err.message}` }, cookies);
			return message({ type: 'error', text: `Unexpected Error: ${err.message}` });
		}
	}
};
