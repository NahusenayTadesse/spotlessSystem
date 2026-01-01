import { eq } from 'drizzle-orm'
import {  redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  user,  rolePermissions, specialPermissions, roles, permissions  } from '$lib/server/db/schema/'

export const load: LayoutServerLoad = async ({locals}) => {
	
     if (!locals.user) {
			redirect(302, '/login');
		}
    
   try {
  
    const [rolePerms, specialPerms, dbUser, branch] = await Promise.all([
      db
        .select({ name: permissions.name })
        .from(user)
        .innerJoin(roles, eq(user.roleId, roles.id))
        .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(user.id, locals.user.id)),

      db
        .select({ name: permissions.name })
        .from(specialPermissions)
        .innerJoin(permissions, eq(specialPermissions.permissionId, permissions.id))
        .where(eq(specialPermissions.userId, locals.user.id)),

      db
        .select({
          id: user.id,
          roleName: roles.name,
          name: user.name,
          branch: user.branchId
        })
        .from(user)
        .innerJoin(roles, eq(user.roleId, roles.id))
        .where(eq(user.id, locals.user.id))
        .then(r => r[0]),
      db
         .select({
            id: user.branchId
         }).from(user)
           .where(eq(user.id, locals.user.id))
    ]);

    return {
      permList: specialPerms.length ? specialPerms : rolePerms,
      role: dbUser,
      branch
    };
  } catch (err) {
    /* Re-throw redirects, handle only real errors */
    if (err instanceof Error && err.message.startsWith('Redirect')) {
      throw err;
    }
    // console.error('DB error in layout load:', err);
    // /* You can return a 500 here or let it bubble */
    // throw error(500, 'Unable to load user data');
  }
};