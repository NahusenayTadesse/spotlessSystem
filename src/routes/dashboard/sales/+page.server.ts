import { db } from '$lib/server/db';
import {
	commissionProduct,
	commissionService,
	customers,
	paymentMethods,
	products as prds,
	reports,
	services as srvs,
	employee,
	tipsProduct,
	tipsService,
	transactionProducts,
	transactions,
	transactionServices
} from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { salesSchema as schema } from '$lib/zodschemas/salesSchema';
import type { Actions } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';

export async function load({ locals }) {
	const fetchedServices = await db
		.select({
			value: srvs.id,
			name: sql<string>`TRIM(CONCAT(${srvs.name}, ' ', COALESCE(CONCAT(${srvs.price}, ' ETB'), '')))`,
			price: srvs.price
		})
		.from(srvs)
		.where(eq(srvs.branchId, locals.user?.branch));

	const fetchedProducts = await db
		.select({
			value: prds.id,
			name: sql<string>`TRIM(CONCAT(${prds.name}, ' ', COALESCE(CONCAT(${prds.price}, ' ETB'), '')))`,
			price: prds.price
		})
		.from(prds)
		.where(eq(prds.branchId, locals.user?.branch));

	const fetchedStaff = await db
		.select({
			value: employee.id,
			name: sql<string>`TRIM(CONCAT(${employee.firstName}, ' ', COALESCE(${employee.lastName}, '')))`
		})
		.from(employee)
		.where(eq(employee.branchId, locals.user?.branch));

	const fetchedCustomer = await db
		.select({
			value: customers.id,
			name: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`
		})
		.from(customers)
		.where(eq(customers.branchId, locals.user?.branch));

	const form = await superValidate(zod4(schema));

	const allMethods = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name,
			description: paymentMethods.description
		})
		.from(paymentMethods)
		.where(eq(paymentMethods.isActive, true));
	return {
		services: fetchedServices,
		products: fetchedProducts,
		staffes: fetchedStaff,
		customers: fetchedCustomer,
		allMethods,
		form
	};
}
// import fs from 'node:fs';
// import path from 'node:path';
// import { generateUserId } from '$lib/global.svelte';
// import { Readable } from 'node:stream';
// import { pipeline } from 'node:stream/promises';
// import { env } from '$env/dynamic/private';

// const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

// if (!fs.existsSync(FILES_DIR)) {
// 	fs.mkdirSync(FILES_DIR, { recursive: true });
// }
import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	addSales: async ({ request, cookies, locals }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod4(schema));

		const { paymentMethod, total, receipt } = form.data;

		const product_staff = formData.getAll('product_staff');
		const product = formData.getAll('product');
		const noofproducts = formData.getAll('noofproducts');
		const tip = formData.getAll('tip');

		const service_staff = formData.getAll('service_staff');
		const service = formData.getAll('service');
		const serviceTip = formData.getAll('serviceTip');

		const isProductStaffEmpty = product_staff.length === 0;
		const isProductEmpty = product.length === 0;

		const isServiceStaffEmpty = service_staff.length === 0;
		const isServiceEmpty = service.length === 0;

		console.log(product.length + ' ' + product_staff.length);

		// Validation: both must match (either both empty or both filled)
		if (isProductStaffEmpty !== isProductEmpty) {
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		if (isServiceStaffEmpty !== isServiceEmpty) {
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		try {
			const recieptLink = await saveUploadedFile(receipt);
			delete form.data.receipt;
			await db.transaction(async (tx) => {
				// 1. master transaction row
				const [txn] = await tx
					.insert(transactions)
					.values({
						amount: total,
						paymentStatus: 'paid', // or map from UI if you add the field
						paymentMethodId: paymentMethod,
						recieptLink,
						branchId: locals.user?.branch,
						createdBy: locals.user?.id
					})
					.$returningId();

				const fetchedProducts = await tx // ← tx, not db
					.select({ value: prds.id, price: prds.price, commissionPct: prds.commissionAmount })
					.from(prds)
					.where(eq(prds.branchId, locals.user?.branch));

				const fetchedServices = await tx // ← tx, not db
					.select({ value: srvs.id, price: srvs.price, commissionPct: srvs.commissionAmount })
					.from(srvs)
					.where(eq(srvs.branchId, locals.user?.branch));

				// 2. product lines
				if (product.length) {
					const txnPrdId = await tx
						.insert(transactionProducts)
						.values(
							product.map((_, idx) => ({
								transactionId: txn.id,
								staffId: product_staff[idx] || null,
								productId: product[idx] || null,
								quantity: noofproducts[idx],
								unitPrice: getPrice(fetchedProducts, Number(product[idx])),
								tip: tip[idx],
								total:
									Number(getPrice(fetchedProducts, Number(product[idx]))) *
										Number(noofproducts[idx]) +
									Number(tip[idx] || 0),
								branchId: locals.user?.branch,
								createdBy: locals.user?.id
							}))
						)
						.$returningId();

					const today = new Date();

					await tx.insert(commissionProduct).values(
						product.map((_, idx) => ({
							saleItemId: txnPrdId[idx].id,
							staffId: product_staff[idx],
							amount:
								Number(getCommission(fetchedProducts, Number(product[idx]))) *
								Number(noofproducts[idx]),
							commissionDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await tx.insert(tipsProduct).values(
						product.map((_, idx) => ({
							saleItemId: txnPrdId[idx].id,
							staffId: product_staff[idx],
							amount: tip[idx],
							tipDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await Promise.all(
						product.map((_, idx) =>
							tx
								.update(prds)
								.set({
									quantity: sql`${prds.quantity} - ${noofproducts[idx]}`
								})
								.where(eq(prds.id, product[idx]))
						)
					);
				}

				// 4. service lines
				if (service.length) {
					const txnsrvid = await tx
						.insert(transactionServices)
						.values(
							service.map((_, idx) => ({
								transactionId: txn.id,
								staffId: service_staff[idx] || null,
								serviceId: service[idx] || null,
								price: Number(getPrice(fetchedServices, Number(service[idx]))),
								tip: serviceTip[idx],
								total:
									Number(getPrice(fetchedServices, Number(service[idx]))) +
									Number(serviceTip[idx] || 0)
							}))
						)
						.$returningId();
					const today = new Date();
					await tx.insert(commissionService).values(
						service.map((_, idx) => ({
							saleItemId: txnsrvid[idx].id,
							staffId: service_staff[idx],
							amount: Number(getCommission(fetchedServices, Number(service[idx]))),
							commissionDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await tx.insert(tipsService).values(
						service.map((_, idx) => ({
							saleItemId: txnsrvid[idx].id,
							staffId: service_staff[idx],
							amount: serviceTip[idx],
							tipDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);
				}

				const today = new Date();

				const sumProduct = noofproducts.reduce((acc, n) => acc + Number(n), 0);

				const existingReport = await tx
					.select({
						id: reports.id
					})
					.from(reports)
					.where(and(eq(reports.reportDate, sql`CURDATE()`)))
					.then((rows) => rows[0]);

				if (existingReport) {
					await tx
						.update(reports)
						.set({
							productsSold: sql<number>`${reports.productsSold} + ${sumProduct}`,
							servicesRendered: sql<number>`${reports.servicesRendered} + ${service.length}`,
							dailyIncome: sql`${sql`IFNULL(${reports.dailyIncome}, 0)`} + ${total}`,
							transactions: sql<number>`${reports.transactions} + 1`
						})
						.where(and(eq(reports.id, existingReport.id)));
				} else {
					await tx.insert(reports).values({
						reportDate: today,
						productsSold: sumProduct,
						servicesRendered: service.length,
						dailyIncome: total,
						transactions: 1
					});
				}
			});

			setFlash({ type: 'success', message: 'New Sale Successfully Added' }, cookies);
			return message(form, { type: 'success', text: 'New Sale Successfully Added' });
		} catch (e) {
			setFlash({ type: 'error', message: 'Error ' + e?.message }, cookies);
			return message(form, { type: 'error', text: 'Error ' + e?.message });
		}
	}
};

function getPrice(list: Array<{ value: number; price: string }>, value: number): number {
	const item = list.find((i) => i.value === value);
	return item ? Number(item.price) : 0;
}

function getCommission(
	list: Array<{ value: number; price: string; commissionPct: string | null }>,
	value: number
): number {
	const item = list.find((i) => i.value === value);
	if (!item) return 0;

	const fixedCommissionAmount = Number(item.commissionPct ?? 0);
	return fixedCommissionAmount;
}
