import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	staff,
	deductions,
	commissionService,
	commissionProduct,
	bonuses,
	overTime,
	products,
	services,
	transactionProducts,
	transactionServices,
	tipsProduct,
	tipsService
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { saveUploadedFile } from '$lib/server/upload';

import { currentMonthFilter } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { range } = params;

	const [y1, m1, d1, y2, m2, d2, id] = range.split('-');

	const start = `${y1}-${m1}-${d1}`;
	const end = `${y2}-${m2}-${d2}`;

	// --- Select Commissions (Service) ---
	const serviceCommissions = await db
		.select({
			staffId: commissionService.staffId,
			service: services.name,
			amount: commissionService.amount,
			date: commissionService.commissionDate
		})
		.from(commissionService)
		.leftJoin(transactionServices, eq(commissionService.saleItemId, transactionServices.id))
		.leftJoin(services, eq(transactionServices.serviceId, services.id))

		.where(
			and(
				currentMonthFilter(commissionService.commissionDate, start, end),

				eq(commissionService.staffId, id)
			)
		);

	// --- Select Commissions (Product) ---
	const productCommissions = await db // <-- add await
		.select({
			staffId: commissionProduct.staffId,
			product: products.name,
			amount: commissionProduct.amount,
			date: commissionProduct.commissionDate
		})
		.from(commissionProduct)
		.leftJoin(transactionProducts, eq(commissionProduct.saleItemId, transactionProducts.id))
		.leftJoin(products, eq(transactionProducts.productId, products.id))

		.where(
			and(
				eq(commissionProduct.staffId, id),
				currentMonthFilter(commissionProduct.commissionDate, start, end)
			)
		);

	const serviceTips = await db
		.select({
			staffId: tipsService.staffId,
			service: services.name,
			amount: tipsService.amount,
			date: tipsService.tipDate
		})
		.from(tipsService)
		.leftJoin(transactionServices, eq(tipsService.saleItemId, transactionServices.id))
		.leftJoin(services, eq(transactionServices.serviceId, services.id))

		.where(
			and(
				currentMonthFilter(tipsService.tipDate, start, end),

				eq(tipsService.staffId, id)
			)
		);

	const productTips = await db // <-- add await
		.select({
			staffId: tipsProduct.staffId,
			product: products.name,
			amount: tipsProduct.amount,
			date: tipsProduct.tipDate
		})
		.from(tipsProduct)
		.leftJoin(transactionProducts, eq(tipsProduct.saleItemId, transactionProducts.id))
		.leftJoin(products, eq(transactionProducts.productId, products.id))

		.where(and(eq(tipsProduct.staffId, id), currentMonthFilter(tipsProduct.tipDate, start, end)));

	// --- Select Bonuses ---
	const staffBonuses = await db
		.select({
			staffId: bonuses.staffId,

			description: bonuses.description,
			amount: bonuses.amount,
			date: bonuses.bonusDate
		})
		.from(bonuses)
		.where(and(eq(bonuses.staffId, id), currentMonthFilter(bonuses.bonusDate, start, end)));

	// --- Select Overtime ---
	const staffOvertime = await db
		.select({
			staffId: overTime.staffId,
			description: sql<string>`CONCAT('Overtime (', ${overTime.hours}, ' hours at $', ${overTime.amountPerHour}, '/hr)')`,
			amount: overTime.total,
			date: overTime.date
		})
		.from(overTime)
		.where(and(eq(overTime.staffId, id), currentMonthFilter(overTime.date, start, end)));

	// --- Select Deductions ---
	const staffDeductions = await db
		.select({
			staffId: deductions.staffId,
			description: deductions.type, // Using the 'type' column for description
			// Amount is stored as a positive number in the table, but we mark it as a deduction
			amount: deductions.amount,
			date: deductions.deductionDate
		})
		.from(deductions)
		.where(
			and(eq(deductions.staffId, id), currentMonthFilter(deductions.deductionDate, start, end))
		);

	// --- Combine all results using unionAll ---

	return {
		staffDeductions,
		staffOvertime,
		productTips,
		serviceTips,
		staffBonuses,
		productCommissions,
		serviceCommissions,

		start,
		end
	};
};

//
export const actions: Actions = {
	editStaff: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { staffId, firstName, lastName, position, phone, email, hiredAt, govId, contract } =
			form.data;

		try {
			const files = await db
				.select({ govtId: staff.govtId, contract: staff.contract })
				.from(staff)
				.where(eq(staff.id, staffId))
				.then((rows) => rows[0]);
			let newGovId: string | null;
			let newContract: string | null;
			if (govId && govId.size > 0) {
				const imageName = await saveUploadedFile(govId);
				delete form.data.govId;
				newGovId = imageName;
			} else {
				newGovId = files.govtId;
			}

			if (contract && contract.size > 0) {
				const contractName = await saveUploadedFile(contract);
				delete form.data.contract;
				newContract = contractName;
			} else {
				newContract = files.contract;
			}

			await db
				.update(staff)
				.set({
					firstName,
					lastName,
					type: position,
					phone,
					email,
					hireDate: new Date(hiredAt),
					govtId: newGovId,
					contract: newContract,
					updatedBy: locals?.user?.id
				})
				.where(eq(staff.id, staffId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Service Updated Successuflly' }, cookies);
			return message(form, { type: 'success', text: 'Staff Member Updated Successfully!' });
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return message(form, {
				type: 'error',
				text: 'An error occurred while updating the staff member. ' + err?.message
			});
		}
	},
	delete: async ({ cookies, params }) => {
		const { range } = params;

		const id = range.split('-').pop()!;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(staff).where(eq(staff.id, id));

			setFlash({ type: 'success', message: 'Staff Member Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting staff member:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}
};
