import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	employee,
	salaries,
	user,
	products,
	services,
	transactionServices,
	transactions,
	paymentMethods,
	transactionSupplies,
	supplies
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const singleTransaction = await db
		.select({
			id: transactions.id,
			date: sql<string>`DATE_FORMAT(${transactions.createdAt}, '%W %Y-%m-%d')`,
			amount: transactions.amount,
			paymentMethods: paymentMethods.name,
			noOfServices: sql<number>`COUNT(${transactionServices.id})`,
			noOfSupplies: sql<number>`COUNT(${transactionSupplies.id})`,
			recievedBy: user.name,
			recievedById: user.id,
			recieptLink: transactions.recieptLink
		})
		.from(transactions)
		.leftJoin(transactionServices, eq(transactionServices.transactionId, transactions.id))
		.leftJoin(transactionSupplies, eq(transactionSupplies.transactionId, transactions.id))
		.leftJoin(paymentMethods, eq(transactions.paymentMethodId, paymentMethods.id))
		.leftJoin(user, eq(transactions.createdBy, user.id))
		.groupBy(
			transactions.id,
			transactions.createdAt,
			transactions.amount,
			paymentMethods.name,
			user.name,
			user.id,
			transactions.recieptLink
		)
		.where(eq(transactions.id, Number(id)))
		.then((rows) => rows[0]);

	const soldServices = await db
		.select({
			name: services.name,
			price: transactionServices.price,
			serviceId: services.id,
			tip: transactionServices.tip,
			doneBy: sql<string>`
      TRIM(CONCAT(${employee.name}, ' ', COALESCE(${employee.fatherName}, '')))
    `,
			total: sql<number>`${transactionServices.price} + ${transactionServices.tip}`,
			quantity: sql<number>`1`
		})
		.from(transactionServices)
		.leftJoin(services, eq(transactionServices.serviceId, services.id))
		.leftJoin(employee, eq(transactionServices.staffId, employee.id))
		.where(eq(transactionServices.transactionId, Number(id)));

	const boughtSupplies = await db
		.select({
			name: supplies.name,
			supplyId: supplies.id,
			quantity: transactionSupplies.quantity,
			price: transactionSupplies.unitPrice,
			reciever: user.name,
			total: sql<number>`
      (${transactionSupplies.quantity} * ${transactionSupplies.unitPrice})
    `
		})
		.from(transactionSupplies)
		.leftJoin(supplies, eq(transactionSupplies.supplyId, supplies.id))
		.leftJoin(user, eq(transactionSupplies.createdBy, user.id)) // <-- REQUIRED
		.where(eq(transactionSupplies.transactionId, Number(id)));

	return {
		singleTransaction,
		soldServices,
		boughtSupplies,

		form
	};
};
