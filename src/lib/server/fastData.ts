import { db } from '$lib/server/db';
import { eq, and, sql, isNull } from 'drizzle-orm';
import {
	city,
	region,
	subcity,
	employee,
	employmentStatuses,
	paymentMethods as paymentMethod,
	supplySuppliers,
	employeeTermination,
	supplyTypes,
	serviceCategories,
	services
} from '$lib/server/db/schema/';

export async function cities() {
	const cities = await db
		.select({
			value: city.id,
			name: city.name
		})
		.from(city)
		.where(eq(city.status, true));

	return cities;
}

export async function regions() {
	const regions = await db
		.select({
			value: region.id,
			name: region.name
		})
		.from(region)
		.where(eq(region.status, true));

	return regions;
}

export async function subcities() {
	const subcities = await db
		.select({
			value: subcity.id,
			name: subcity.name
		})
		.from(subcity)
		.where(eq(subcity.status, true));

	return subcities;
}

export async function paymentMethods() {
	const paymentMethods = await db
		.select({
			value: paymentMethod.id,
			name: paymentMethod.name
		})
		.from(paymentMethod)
		.where(eq(paymentMethod.isActive, true));

	return paymentMethods;
}

export async function suppliers() {
	const suppliers = await db
		.select({
			value: supplySuppliers.id,
			name: supplySuppliers.name
		})
		.from(supplySuppliers)
		.where(eq(supplySuppliers.status, true));

	return suppliers;
}
export async function employees() {
	const employees = await db
		.select({
			value: employee.id,
			name: sql<string>`CONCAT(${employee.name}, ' ', ${employee.fatherName})`
		})
		.from(employee)
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.leftJoin(employeeTermination, eq(employeeTermination.staffId, employee.id))
		.where(
			and(
				eq(employee.isActive, true),
				eq(employmentStatuses.removeFromLists, false),
				isNull(employeeTermination.staffId)
			)
		);

	return employees;
}

export async function supplyCategories() {
	const supplyCategories = await db
		.select({
			value: supplyTypes.id,
			name: supplyTypes.name
		})
		.from(supplyTypes);

	return supplyCategories;
}

export async function serviceCategory() {
	const categories = await db
		.select({
			value: serviceCategories.id,
			name: serviceCategories.name
		})
		.from(serviceCategories);

	return categories;
}

export async function service() {
	const service = await db
		.select({
			value: services.id,
			name: services.name
		})
		.from(services);

	return service;
}
