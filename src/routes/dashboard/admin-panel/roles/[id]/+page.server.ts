import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editRoleSchema as schema } from './schema';

import { db } from '$lib/server/db';
import { roles, user, permissions, rolePermissions, session } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const form = await superValidate(zod4(schema));

	const singleUser = await db
		.select({
			id: roles.id,
			name: roles.name,
			description: roles.description,
			userCount: sql<number>`COUNT(DISTINCT ${user.id})`,
			permissionsCount: sql<number>`COUNT(DISTINCT ${rolePermissions.id})`
		})
		.from(roles)
		.leftJoin(user, eq(user.roleId, roles.id))
		.leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
		.groupBy(roles.id, roles.name, roles.isActive, user.id)
		.where(eq(roles.id, id))
		.then((rows) => rows[0]);

	if (!singleUser) {
		return error(404, { message: 'Role not found' });
	}

	const permissionList = await db
		.select({
			id: permissions.id,
			name: permissions.name,
			description: permissions.description
		})
		.from(permissions)
		.innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))

		.where(eq(rolePermissions.roleId, id));

	return {
		singleUser,
		id,
		form,

		permissionList
	};
};

// import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	edit: async ({ request, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for Errors' });
		}

		const { name, description, permissions } = form.data;

		try {
			await db
				.update(roles)
				.set({ name, description })
				.where(eq(roles.id, Number(id)));

			await db.delete(rolePermissions).where(eq(rolePermissions.roleId, Number(id)));

			await db.insert(rolePermissions).values(
				permissions.map((permId) => ({
					roleId: Number(id),
					permissionId: Number(permId)
				}))
			);

			return message(form, { type: 'success', text: 'Role updated successfully.' });
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY')
				return setError(form, 'name', 'Role updated already exists.');

			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Role Name is already taken. Please choose another one.'
						: err.message
			});
		}
	}
} satisfies Actions;
