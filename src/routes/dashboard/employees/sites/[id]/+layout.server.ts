import { db } from '$lib/server/db';
import { site } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	let siteName = await db
		.select({
			name: site.name
		})
		.from(site)
		.where(eq(site.id, id))
		.then((res) => res[0]?.name);
	return {
		siteName
	};
};
