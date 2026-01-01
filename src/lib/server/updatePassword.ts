import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
export async function updateUserPassword(userId: string, newPassword: string) {
	const userToUpdate = await db.select().from(user).where(eq(user.id, userId));
	const userData = userToUpdate[0];
	if (!userData) return false;

	const hashedPassword = await hash(newPassword);

	// Update the user's password (hashing/salting should be done here)
	await db.update(user).set({ passwordHash: hashedPassword }).where(eq(user.id, userId));
	return true;
}
