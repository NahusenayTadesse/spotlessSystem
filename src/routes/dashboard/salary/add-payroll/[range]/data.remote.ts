import { query } from '$app/server';
import { taxTypes } from '$lib/server/fastData';
export const getTaxTypes = query(async () => {
	const posts = await taxTypes();

	return posts;
});
