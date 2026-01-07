import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	products,
	services,
	employee,
	staffTypes,
	tipsProduct,
	transactionProducts,
	transactionServices,
	user
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { tipsService } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { range } = params;

	const id = range.split('-').pop();

	const form = await superValidate(zod4(schema));

	const staffMember = await db
		.select({
			id: employee.id,
			firstName: employee.firstName,
			lastName: employee.lastName,

			category: staffTypes.name,
			categoryId: staffTypes.id,
			phone: employee.phone,
			email: employee.email,
			status: employee.employmentStatus,
			hireDate: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`,
			govId: employee.govtId,
			contract: employee.contract,

			addedBy: user.name,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`
		})
		.from(employee)
		.leftJoin(staffTypes, eq(employee.type, staffTypes.id))
		.leftJoin(user, eq(employee.createdBy, user.id))
		.where(and(eq(employee.branchId, locals?.user?.branch), eq(employee.id, id)))
		.then((rows) => rows[0]);

	const today = new Date().toISOString().split('T')[0];
	const serviceTipsToday = await db
		.select({
			staffId: tipsService.staffId,
			service: services.name,
			amount: tipsService.amount,
			date: tipsService.tipDate
		})
		.from(tipsService)
		.leftJoin(transactionServices, eq(tipsService.saleItemId, transactionServices.id))
		.leftJoin(services, eq(transactionServices.serviceId, services.id))

		.where(and(eq(tipsService.staffId, id), eq(tipsService.tipDate, today)));

	const productTipsToday = await db
		.select({
			staffId: tipsProduct.staffId,
			product: products.name,
			amount: tipsProduct.amount,
			date: tipsProduct.tipDate
		})
		.from(tipsProduct)
		.leftJoin(transactionProducts, eq(tipsProduct.saleItemId, transactionProducts.id))
		.leftJoin(products, eq(transactionProducts.productId, products.id))

		.where(and(eq(tipsProduct.staffId, id), eq(tipsProduct.tipDate, today)));

	const categories = await db
		.select({
			value: staffTypes.id,
			name: staffTypes.name,
			description: staffTypes.description
		})
		.from(staffTypes);

	return {
		staffMember,
		form,
		categories,
		productTipsToday,
		serviceTipsToday
	};
};
