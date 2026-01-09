import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { inventoryAdjustmentFormSchema as adjustSchema } from '$lib/ZodSchema';

import { edit as schema } from './schema';

import { db } from '$lib/server/db';
import {
	supplies,
	transactionSupplies,
	transactions,
	suppliesAdjustments
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { saveUploadedFile } from '$lib/server/upload';

// export const load: PageServerLoad = async ({ params, locals }) => {
// 	const { id } = params;
// 	const form = await superValidate(zod4(schema));
// 	const adjustForm = await superValidate(zod4(adjustSchema));

// 	const supply = await db
// 		.select({
// 			id: supplies.id,
// 			name: supplies.name,
// 			costPerUnit: supplies.costPerUnit,
// 			description: supplies.description,
// 			quantity: supplies.quantity,
// 			reorderLevel: supplies.reorderLevel,
// 			unitOfMeasure: supplies.unitOfMeasure,
// 			supplier: supplies.supplier,
// 			createdBy: user.name,
// 			createdAt: sql<string>`DATE_FORMAT(${supplies.createdAt}, '%Y-%m-%d')`,
// 			paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
// 		})
// 		.from(supplies)
// 		.leftJoin(transactionSupplies, eq(supplies.id, transactionSupplies.supplyId))
// 		.leftJoin(transactions, eq(transactionSupplies.transactionId, transactions.id))
// 		.leftJoin(user, eq(supplies.createdBy, user.id))
// 		.where(and(eq(supplies.branchId, locals?.user?.branch), eq(supplies.id, id)))
// 		.groupBy(
// 			supplies.id,
// 			supplies.name,
// 			supplies.costPerUnit,
// 			supplies.description,
// 			supplies.quantity,
// 			supplies.reorderLevel,
// 			supplies.supplier,
// 			user.name,
// 			supplies.createdAt
// 		)
// 		.then((rows) => rows[0]);

// 	if (!supply) {
// 		throw error(404, 'Supply not found, it has been deleted or never have existed.');
// 	}

// 	return {
// 		supply,
// 		form,
// 		adjustForm
// 	};
// };

export const actions: Actions = {
	editSupply: async ({ request, cookies, locals, params }) => {
		const form = await superValidate(request, zod4(schema));
		const { id } = params;

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const {
			name,
			description,
			supplyType,
			unitOfMeasurement,
			otherUnitOfMeasurement,
			reorderLevel
		} = form.data;

		try {
			await db
				.update(supplies)
				.set({
					name,
					description,
					supplyTypeId: supplyType,
					quantity: 0,
					unitOfMeasure: unitOfMeasurement === 'other' ? otherUnitOfMeasurement : unitOfMeasurement,
					reorderLevel,
					createdBy: locals?.user?.id
				})
				.where(eq(supplies.id, Number(id)));

			// Stay on the same page and set a flash message
			return message(form, { type: 'success', text: 'Supply updated successfully' });
		} catch (err) {
			console.error(err?.message);
			return message(form, { type: `error', text: 'Unexpected Error: ${err?.message}` });
		}
	},
	adjust: async ({ request, cookies, params, locals }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(adjustSchema));

		const { intent, quantity, reason, reciept } = form.data;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}
			const adjustment = intent === 'add' ? Number(quantity) : -Number(quantity);

			if (reciept) {
				const recieptLink = await saveUploadedFile(reciept);

				const [transactionId] = await db
					.insert(transactions)
					.values({
						amount: adjustment,
						recieptLink,
						reason,
						createdBy: locals.user?.id,
						branchId: locals.user?.branch
					})
					.$returningId();
				const [supTrans] = await db
					.insert(transactionSupplies)
					.values({
						transactionId: transactionId.id,
						supplyId: id,
						quantity: adjustment
					})
					.$returningId();

				await db.insert(suppliesAdjustments).values({
					suppliesId: id,
					adjustment,
					reason,
					transactionId: supTrans.id,
					createdBy: locals.user?.id
				});
				await db
					.update(supplies)
					.set({
						quantity: sql`quantity + ${adjustment}`,
						updatedBy: locals.user?.id
					})
					.where(eq(supplies.id, id));
			} else {
				await db.insert(suppliesAdjustments).values({
					suppliesId: id,
					adjustment,
					reason,
					createdBy: locals.user?.id
				});

				await db
					.update(supplies)
					.set({
						quantity: sql`quantity + ${adjustment}`,
						updatedBy: locals.user?.id
					})
					.where(eq(supplies.id, id));
			}
			setFlash({ type: 'success', message: 'Supply Quantity Successuflly Updated' }, cookies);
			return message(form, { type: 'success', text: 'Supply Quantity updated successfully' });
		} catch (err) {
			console.error('Error adjusting product:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);

			return message(form, { type: 'error', text: 'Unexpected Error ' + err?.message });
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(supplies).where(eq(supplies.id, id));

			setFlash({ type: 'success', message: 'Supply Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting supply:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}

	// delete: async ({ cookies, params }) => {
	// 	const { id } = params;

	// 	try {
	// 		if (!id) {
	// 			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
	// 			return fail(400);
	// 		}

	// 		await db.delete(supplies).where(eq(supplies.id, id));

	// 		setFlash({ type: 'success', message: 'Supply Deleted Successfully!' }, cookies);
	// 	} catch (err) {
	// 		console.error('Error deleting supply:', err);
	// 		setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
	// 		return fail(400);
	// 	}
	// }
};
