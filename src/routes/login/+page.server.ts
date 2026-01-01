import { verify } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema/';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/ZodSchema';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	const form = await superValidate(zod4(loginSchema));

	return { form };
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event.request, zod4(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const { email, password } = form.data;

			const result = await db
				.select()
				.from(table.user)
				.where(and(eq(table.user.email, email), eq(table.user.isActive, true)))
				.then((rows) => rows[0]);

			if (!result) {
				setError(form, 'email', 'Incorrect username or password');
				setError(form, 'password', 'Incorrect username or password');
				return message(form, { type: 'error', text: 'Incorrect username or password' });
			}

			const validPassword = await verify(result.passwordHash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			if (!validPassword) {
				setError(form, 'email', 'Incorrect username or password');
				setError(form, 'password', 'Incorrect username or password');
				return message(form, { type: 'error', text: 'Incorrect username or password' });
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, result.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			redirect('/dashboard', { type: 'success', message: 'Login Successful!' }, event.cookies);
		} catch (error) {
			return message(form, { type: 'error', text: 'An error occurred while logging in' });
		}
	}
	// register: async (event) => {
	// 	const formData = await event.request.formData();
	// 	const username = formData.get('username');
	// 	const password = formData.get('password');

	// 	if (!validateUsername(username)) {
	// 		return fail(400, { message: 'Invalid username' });
	// 	}
	// 	if (!validatePassword(password)) {
	// 		return fail(400, { message: 'Invalid password' });
	// 	}

	// 	const userId = generateUserId();
	// 	const passwordHash = await hash(password, {
	// 		// recommended minimum parameters
	// 		memoryCost: 19456,
	// 		timeCost: 2,
	// 		outputLen: 32,
	// 		parallelism: 1
	// 	});

	// 	try {
	// 		await db.insert(table.user).values({ id: userId, username, passwordHash });

	// 		const sessionToken = auth.generateSessionToken();
	// 		const session = await auth.createSession(sessionToken, userId);
	// 		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	// 	} catch {
	// 		return fail(500, { message: 'An error has occurred' });
	// 	}
	// 	return redirect(302, '/demo/lucia');
	// }
};

// function generateUserId() {
// 	// ID with 120 bits of entropy, or about the same as UUID v4.
// 	const bytes = crypto.getRandomValues(new Uint8Array(15));
// 	const id = encodeBase32LowerCase(bytes);
// 	return id;
// }

// function validateUsername(username: unknown): username is string {
// 	return (
// 		typeof username === 'string' &&
// 		username.length >= 3 &&
// 		username.length <= 31 &&
// 		/^[a-z0-9_-]+$/.test(username)
// 	);
// }

// function validatePassword(password: unknown): password is string {
// 	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
// }

// function extractUsername(email: string) {
//   if (typeof email !== "string") {
//     throw new Error("Input must be a string");
//   }

//   // Find the part before the '@'
//   const atIndex = email.indexOf("@");

//   if (atIndex === -1) {
//     throw new Error("Invalid email address: missing '@'");
//   }

//   return email.substring(0, atIndex);
// }
