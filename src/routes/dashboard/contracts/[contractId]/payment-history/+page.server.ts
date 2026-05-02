import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {
	transactions,
	siteMonthlyPayments,
	user,
	services,
	siteContracts,
	paymentMethods
} from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from '../$types';

import { setError, superValidate } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { editContract } from './schema';
import { subcities, service, customerList } from '$lib/server/fastData';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { contractId } = params;

	const form = await superValidate(zod4(editContract));

	// const contractYearMonth = await db
	// 	.select({
	// 		year: siteContracts.contractYear,
	// 		month: siteMonthlyPayments.month
	// 	})
	// 	.from(siteContracts)
	// 	.where(eq(siteContracts.id, Number(contractId)))
	// 	.then((rows) => rows[0]);

	let contracts = await db
		.select({
			id: siteContracts.id,
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
			terminated: siteContracts.terminated,
			terminationReason: siteContracts.terminationReason,
			inActiveReason: siteContracts.inActiveReason,
			terminationDate: siteContracts.terminationDate,

			addedBy: user.name,
			addedById: user.id
		})
		.from(siteContracts)
		.leftJoin(services, eq(siteContracts.serviceId, services.id))
		.leftJoin(user, eq(siteContracts.createdBy, user.id))
		.where(eq(siteContracts.id, Number(contractId)))
		.then((rows) => rows[0]);

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
			requestChangeReason: siteMonthlyPayments.requestChangeReason,
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
		.where(eq(siteMonthlyPayments.contractId, Number(contractId)))
		.orderBy(desc(siteMonthlyPayments.date));

	return {
		payments,
		serviceList,
		contracts,
		form
	};
};

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	editContract: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(editContract));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const {
			id,
			service,
			contractDate,
			contractYear,
			startDate,
			endDate,
			contractFile,
			monthlyAmount,
			status,
			commissionConsidered,
			signingOfficer,
			terminated,
			terminationReason,
			terminationDate,
			inActiveReason
		} = form.data;

		if (status === false && inActiveReason === undefined) {
			setError(form, 'inActiveReason', 'Inactive reason is required when status is false');
			return message(form, {
				type: 'error',
				text: `Error: Inactive reason is required when contract is not active`
			});
		}

		if (
			inActiveReason?.trim() === 'Automatic Expiration of Contract By System' &&
			status === false
		) {
			setError(
				form,
				'inActiveReason',
				'InActive Reason can not be the same as Automatic Expiration of Contract By System'
			);
			return message(form, {
				type: 'error',
				text: `Error: InActive Reason can not be the same as Automatic Expiration of Contract By System`
			});
		}

		if (terminated === true && terminationReason === undefined) {
			setError(form, 'terminationReason', 'Termination reason is required when terminated is true');
			return message(form, {
				type: 'error',
				text: `Error: Termination Reason is required when contract is terminated`
			});
		}

		if (terminated === true && terminationDate === undefined) {
			setError(form, 'terminationDate', 'Termination date is required when terminated is true');
			return message(form, {
				type: 'error',
				text: `Error: Termination Date is required when contract is terminated`
			});
		}

		try {
			await db.transaction(async (tx) => {
				if (contractFile) {
					const contractFileName = await saveUploadedFile(contractFile);

					await tx
						.update(siteContracts)
						.set({
							serviceId: service,
							contractDate: new Date(contractDate),
							contractYear,
							startDate: new Date(startDate),
							endDate: new Date(endDate),
							contractFile: contractFileName,
							monthlyAmount: String(monthlyAmount),
							isActive: status,
							commissionConsidered,
							signingOfficer,
							terminated,
							terminationReason,
							inActiveReason,
							terminationDate: terminationDate ? new Date(terminationDate) : null,
							updatedBy: locals?.user?.id
						})
						.where(eq(siteContracts.id, id));
				} else {
					await tx
						.update(siteContracts)
						.set({
							serviceId: service,
							contractDate: new Date(contractDate),
							contractYear,
							startDate: new Date(startDate),
							endDate: new Date(endDate),
							monthlyAmount: String(monthlyAmount),
							isActive: status,
							commissionConsidered,
							signingOfficer,
							terminated,
							terminationReason,
							inActiveReason,
							terminationDate: terminationDate ? new Date(terminationDate) : null,
							updatedBy: locals?.user?.id
						})
						.where(eq(siteContracts.id, id));
				}

				return message(form, {
					type: 'success',
					text: 'Contract Updated Successfully!'
				});
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Updating Contract failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	}
};
