import { db } from '$lib/server/db';
import { eq, and, sql, isNull } from 'drizzle-orm';
import {
	city,
	region,
	subcity,
	department,
	employee,
	employmentStatuses,
	educationalLevel,
	paymentMethods as paymentMethod,
	supplySuppliers,
	employeeTermination,
	supplyTypes,
	serviceCategories,
	services,
	taxType
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

export async function departments() {
	const departments = await db
		.select({
			value: department.id,
			name: department.name
		})
		.from(department);

	return departments;
}

export async function empStatus() {
	const empStatus = await db
		.select({
			value: employmentStatuses.id,
			name: employmentStatuses.name
		})
		.from(employmentStatuses);

	return empStatus;
}

export async function eduLevel() {
	const eduLevel = await db
		.select({
			value: educationalLevel.id,
			name: educationalLevel.name
		})
		.from(educationalLevel);

	return eduLevel;
}

export async function taxTypes() {
	const taxTypes = await db
		.select({
			value: taxType.id,
			name: taxType.name,
			rate: taxType.rate,
			threshold: taxType.threshold,
			deduction: taxType.deduction
		})
		.from(taxType)
		.where(eq(taxType.status, true));
	return taxTypes;
}
