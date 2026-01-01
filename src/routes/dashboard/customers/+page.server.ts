import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { appointments, customers, user } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { addCustomer } from '$lib/ZodSchema';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
	const customersList = await db
		.select({
			id: customers.id,
			customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
			phone: customers.phone,
			appointmentCount: sql<number>`COUNT(${appointments.id})`,
			daysSinceJoined: sql<number>`DATEDIFF(CURRENT_DATE, ${customers.createdAt})`,
			createdBy: user.name,
			createdById: user.id,
			createdAt: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`
		})
		.from(customers)
		.leftJoin(appointments, eq(customers.id, appointments.customerId))
		.leftJoin(user, eq(customers.createdBy, user.id))
		.where(and(eq(customers.branchId, locals?.user?.branch)))
		.groupBy(
			customers.id,
			user.name,
			customers.createdAt,
			customers.firstName,
			customers.lastName,
			customers.phone
		);

	return {
		customersList
	};
};

export const actions: Actions = {
	addCustomer: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(addCustomer));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form.' }, cookies);
			return fail(400, { form });
		}
		const { firstName, lastName, gender, phone } = form.data;

		try {
			 await db.insert(customers).values({
				firstName,
				lastName,
				gender: gender === 'male' || gender === 'female' ? gender : undefined,
				phone,
				createdBy: locals?.user?.id,
        branchId: locals?.user?.branch
			});

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Customer Successfully Added' }, cookies);
			return {
				form
			};
		} catch(err){
             console.error("Error" + err)
             setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Phone number is already taken. Please choose another one.': err.message }, cookies);
                    
                 if(err.code === 'ER_DUP_ENTRY')
                        return setError(form, 'phone', 'Phone Number already exists.');
                       
             
                     return fail(400, {
                     form
                   });
        }
	}
};
