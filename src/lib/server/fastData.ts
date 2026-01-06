import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { city, region, subcity, paymentMethods as paymentMethod } from '$lib/server/db/schema/';

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
