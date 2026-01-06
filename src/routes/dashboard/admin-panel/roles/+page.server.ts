import { db } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { user, roles, rolePermissions } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const roleList = await db
		.select({
			id: roles.id,
			name: roles.name,
			status: roles.isActive,
			permissionsCount: sql<number>`COUNT(DISTINCT ${rolePermissions.id})`
		})
		.from(roles)
		.leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
		.groupBy(roles.id, roles.name, roles.isActive);

	return {
		roleList
	};
};
