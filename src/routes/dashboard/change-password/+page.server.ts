import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { changePasswordSchema as schema } from './schema';
import type { Actions, PageServerLoad } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));

	return { form };
};

async function updateUserPassword(userId: string, newPassword: string) {
	const userToUpdate = await db.select().from(user).where(eq(user.id, userId));
	const userData = userToUpdate[0];
	if (!userData) return false;

	const hashedPassword = await hash(newPassword);

	// Update the user's password (hashing/salting should be done here)
	await db.update(user).set({ passwordHash: hashedPassword }).where(eq(user.id, userId));
	return true;
}
async function validateNewPassword(newPassword: string) {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
	if (!passwordRegex.test(newPassword)) {
		return false;
	} else {
		return true;
	}
}

export const actions: Actions = {
	changePassword: async (event) => {
		const form = await superValidate(event.request, zod4(schema));
		if (!form.valid) return fail(400, { form });
		const { currentPassword, newPassword } = form.data;

		const currentUser = await db
			.select({
				id: user.id,
				passwordHash: user.passwordHash
			})
			.from(user)
			.where(eq(user.id, event.locals?.user?.id))
			.then((rows) => rows[0]);
		// if (!await validateCurrentPassword(userId, currentPassword)) {
		//     return fail(400, { passwordError: 'Current password is incorrect.' });
		// }

		const validPassword = await verify(currentUser.passwordHash, currentPassword, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			setFlash({ type: 'error', message: 'Current password is incorrect.' }, event.cookies);
		}

		// Example: Get userId from session/auth
		// if (!userId) {
		//     throw redirect(303, '/login');
		// }

		// Example: Validate current password (implement your own logic)
		// if (!await validateCurrentPassword(userId, currentPassword)) {
		//   return fail(400, { error: 'Current password is incorrect.' });
		// }

		const success = await updateUserPassword(event.locals?.user?.id, newPassword);
		if (!success) {
			return fail(500, { success: false, message: 'Failed to update password.' });
		}

		await auth.invalidateSession(event?.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		setFlash({ type: 'success', message: 'Password updated successfully.' }, event.cookies);
		return redirect(302, '/login');
	}
};
