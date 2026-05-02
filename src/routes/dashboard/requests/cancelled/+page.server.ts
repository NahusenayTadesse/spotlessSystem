import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {
	transactions,
	siteMonthlyPayments,
	user,
	services,
	site,
	customers,
	siteContracts,
	employee,
	vatAndWithHold,
	employmentStatuses,
	paymentMethods,
	employeeTermination,
	penality,
	paymentRequest
} from '$lib/server/db/schema';
import { eq, and, isNull, sql, desc, inArray, getTableColumns } from 'drizzle-orm';
import type { PageServerLoad, Actions } from '../$types';

import { setError, superValidate } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { subcities, service, customerList } from '$lib/server/fastData';
import { add } from './schema';

export const load: PageServerLoad = async () => {
	const requests = await db
		.select({
			...getTableColumns(paymentRequest),
			siteName: site.name,
			customerName: customers.name
		})
		.from(paymentRequest)
		.leftJoin(site, eq(site.id, paymentRequest.siteId))
		.leftJoin(customers, eq(customers.id, site.customerId))
		.where(eq(paymentRequest.status, 'rejected'));

	let contracts = await db
		.select({
			id: siteContracts.id,
			siteName: site.name,
			siteId: site.id,
			customerName: customers.name,
			serviceName: services.name,
			service: siteContracts.serviceId,
			startDate: siteContracts.startDate,
			endDate: siteContracts.endDate,
			contractDate: siteContracts.contractDate,
			monthlyAmount: siteContracts.monthlyAmount,
			contractYear: siteContracts.contractYear,
			signedDate: siteContracts.contractDate,
			contractFile: siteContracts.contractFile,
			officeCommission: siteContracts.commissionConsidered,
			commissionConsidered: siteContracts.commissionConsidered,
			status: siteContracts.isActive,
			signingOfficer: siteContracts.signingOfficer,
			addedBy: user.name,
			addedById: user.id
		})
		.from(siteContracts)
		.leftJoin(site, eq(site.id, siteContracts.siteId))
		.leftJoin(customers, eq(customers.id, site.customerId))
		.leftJoin(services, eq(siteContracts.serviceId, services.id))
		.leftJoin(user, eq(siteContracts.createdBy, user.id));

	const serviceList = await service();

	if (!contracts) {
		error(404, 'Contract not found');
	}

	const payments = await db
		.select({
			id: siteMonthlyPayments.id,
			month: siteMonthlyPayments.month,
			year: siteMonthlyPayments.year,
			date: siteMonthlyPayments.date,

			requestAmount: siteMonthlyPayments.requestAmount,
			paymentAmount: siteMonthlyPayments.paymentAmount,
			penaltyAmount: siteMonthlyPayments.penaltyAmount,
			vat: siteMonthlyPayments.vat,
			withholdAmount: siteMonthlyPayments.withholdAmount,
			invoiceNumber: siteMonthlyPayments.invoiceNumber,
			fsNumber: siteMonthlyPayments.fsNumber,
			withholdInvoiceNumber: siteMonthlyPayments.withholdInvoiceNumber,
			paymentMethod: paymentMethods.name,

			requestFile: siteMonthlyPayments.paymentRequestFile,
			withholdFile: siteMonthlyPayments.withholdFile,
			// Joined Fields
			contractId: siteContracts.id,
			receiptFile: transactions.recieptLink,
			transactionId: transactions.id,
			addedBy: user.name // Join on createdBy
		})
		.from(siteMonthlyPayments)
		.innerJoin(siteContracts, eq(siteMonthlyPayments.contractId, siteContracts.id))

		.innerJoin(transactions, eq(siteMonthlyPayments.transactionId, transactions.id))
		.leftJoin(paymentMethods, eq(transactions.paymentMethodId, paymentMethods.id))
		.leftJoin(user, eq(siteMonthlyPayments.createdBy, user.id))
		.orderBy(desc(siteMonthlyPayments.date));

	const employees = await db
		.select({
			value: employee.id,
			name: sql<string>`CONCAT(${employee.name}, ' ', ${employee.fatherName})`,
			signiture: employee.signiture
		})
		.from(employee)
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.leftJoin(employeeTermination, eq(employeeTermination.staffId, employee.id))
		.where(
			and(
				eq(employee.isActive, true),
				eq(employmentStatuses.removeFromLists, false),
				isNull(employeeTermination.staffId),
				eq(employee.departmentId, 8)
			)
		);

	const contractList = await db
		.select({
			value: siteContracts.id,
			name: sql<string>`TRIM(CONCAT(COALESCE(${site.name}, ''), ' (Service: ', ${services.name}, ', ', ${siteContracts.monthlyAmount}, ')'))`,
			monthlyAmount: siteContracts.monthlyAmount
		})
		.from(siteContracts)
		.leftJoin(services, eq(siteContracts.serviceId, services.id))
		.leftJoin(site, eq(siteContracts.siteId, site.id))
		.where(eq(siteContracts.isActive, true));

	const sitesList = await db
		.select({
			value: site.id,
			name: site.name,
			customerName: customers.name
		})
		.from(site)
		.leftJoin(customers, eq(site.customerId, customers.id))
		.where(
			inArray(
				site.id,
				requests.map((request) => request.siteId)
			)
		);

	const vats = await db
		.select()
		.from(vatAndWithHold)
		.limit(1)
		.then((rows) => rows[0]);

	const invoiceNumbers = sitesList.map((contract, index) => {
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

		// Format: INV-[ContractID]-[Timestamp]-[Random/Index]
		return `INV-${contract.value}-${timestamp}-${index}${randomStr}`;
	});

	const form = await superValidate(
		{
			contracts: sitesList.map((contract) => contract.value),
			penalityAmounts: sitesList.map(() => 0),
			invoiceNumbers,
			vat: Number(vats.vat),
			withhold: Number(vats.withHold)
		},
		zod4(add)
	);

	return {
		payments,
		employees,
		contractList,
		serviceList,
		contracts,
		sitesList,
		requests,
		vats,
		form
	};
};

export const actions: Actions = {
	request: async ({ request, locals }) => {
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
			const { id, status, penality, requestDate, requestedBy, month } = form.data;
			const [monthName, year] = month.split('_');

			await db.transaction(async (tx) => {
				await tx
					.update(paymentRequest)
					.set({
						status,
						penality: String(penality),
						requestedBy,
						month: monthName,
						year: Number(year),
						requestDate: new Date(requestDate)
					})
					.where(eq(paymentRequest.id, id));
			});

			return message(form, {
				type: 'success',
				text: `Request Changed successfully!`
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
