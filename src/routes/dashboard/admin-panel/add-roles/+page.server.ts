import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

import { fail } from '@sveltejs/kit';

import { createRoleSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { branches, permissions, rolePermissions, roles, user } from '$lib/server/db/schema/';
import type { PageServerLoad, Actions } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod4(schema));

	const allPermissions = await db
		.select({
			id: permissions.id,
			name: permissions.name,
			description: permissions.description
		})
		.from(permissions);

	const allRoles = await db
		.select({
			value: roles.id,
			name: roles.name,
			description: roles.description
		})
		.from(roles);

	const branch = await db
		.select({
			id: branches.id,
			name: branches.name
		})
		.from(branches);

	return {
		form,
		allPermissions,
		allRoles,
		branch
	};
};

export const actions: Actions = {
	addRoles: async ({ request, cookies }) => {
		console.log('connected');
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			console.log('❌ validation errors:', form.errors); // <-- add this

			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, {
				form
			});
		}

		const { name, description, permissions } = form.data;

		try {
			const [role] = await db.insert(roles).values({ name, description }).$returningId();

			await db.insert(rolePermissions).values(
				permissions.map((permId) => ({
					roleId: role.id,
					permissionId: permId
				}))
			);
			setFlash({ type: 'success', message: `Role created successfully!` }, cookies);

			return message(form, 'Valid form!');

			return {
				form
			};
		} catch (err: any) {
			setFlash(
				{
					type: 'error',
					message:
						err.code === 'ER_DUP_ENTRY'
							? 'Role Name is already taken. Please choose another one.'
							: err.message
				},
				cookies
			);

			if (err.code === 'ER_DUP_ENTRY') return setError(form, 'name', 'Role Name already exists.');

			return fail(400, {
				form
			});
		}
	}
} satisfies Actions;
