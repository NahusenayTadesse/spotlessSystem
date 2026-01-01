import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	editProduct as schema,
	inventoryAdjustmentFormSchema as adjustSchema
} from '$lib/ZodSchema';

import { db } from '$lib/server/db';
import {
	productCategories,
	products,
	transactionProducts,
	transactions,
	user,
	productAdjustments
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));
	const adjustForm = await superValidate(zod4(adjustSchema));

	const product = await db
		.select({
			id: products.id,
			name: products.name,
			price: products.price,
			costPerUnit: products.cost,
			description: products.description,
			category: productCategories.name,
			categoryId: productCategories.id,
			commission: products.commissionAmount,
			quantity: products.quantity,
			reorderLevel: products.reorderLevel,
			supplier: products.supplier,
			saleCount: sql<number>`SUM(${transactionProducts.quantity})`,
			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${products.createdAt}, '%Y-%m-%d')`,
			paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(products)
		.leftJoin(productCategories, eq(productCategories.id, products.categoryId))
		.leftJoin(transactionProducts, eq(products.id, transactionProducts.productId))
		.leftJoin(transactions, eq(transactionProducts.transactionId, transactions.id))
		.leftJoin(user, eq(products.createdBy, user.id))
		.where(and(eq(products.branchId, locals?.user?.branch), eq(products.id, id)))
		.groupBy(
			products.id,
			products.name,
			products.price,
			products.cost,
			products.description,
			productCategories.name,
			products.commissionAmount,
			products.quantity,
			products.supplier,
			products.reorderLevel,
			transactionProducts.id
		)
		.then((rows) => rows[0]);

	const categories = await db
		.select({
			value: productCategories.id,
			name: productCategories.name,
			description: productCategories.description
		})
		.from(productCategories);

	return {
		product,
		form,
		categories,
		adjustForm
	};
};

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	editProduct: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const {
			productId,
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
			await db
				.update(products)
				.set({
					name: productName,
					commissionAmount: commission.toString(),
					description,
					categoryId: category,
					quantity,
					price: price.toString(),
					supplier,
					reorderLevel,
					cost: costPerUnit.toString(),
					updatedBy: locals?.user?.id
				})
				.where(eq(products.id, productId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Product Updated Successuflly Added' }, cookies);

			return message(form, { type: 'success', text: 'Product Updated Successfully' });
		} catch (err) {
			setFlash({ type: 'error', message: 'Product Update Failed ' + err?.message }, cookies);

			return message(form, { type: 'error', text: 'Product Update Failed' + err?.message });
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
						createdBy: locals.user?.id,
						branchId: locals.user?.branch
					})
					.$returningId();

				await db.insert(productAdjustments).values({
					productsId: id,
					adjustment,
					reason,
					transactionId: transactionId.id,
					createdBy: locals.user?.id
				});
				await db
					.update(products)
					.set({
						quantity: sql`quantity + ${adjustment}`,
						updatedBy: locals.user?.id
					})
					.where(eq(products.id, id));
			} else {
				await db.insert(productAdjustments).values({
					productsId: id,
					adjustment,
					reason,
					createdBy: locals.user?.id
				});

				await db
					.update(products)
					.set({
						quantity: sql`quantity + ${adjustment}`,
						updatedBy: locals?.user?.id
					})
					.where(eq(products.id, id));
			}

			setFlash({ type: 'success', message: 'Product Updated Successuflly Added' }, cookies);

			return message(form, { type: 'success', text: 'Product Updated Successfully' });
		} catch (err) {
			console.error('Error adjusting product:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return message(form, { type: 'error', text: 'Unexpected Error' + err?.message });
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(products).where(eq(products.id, id));

			setFlash({ type: 'success', message: 'Product Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting product:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}
};
