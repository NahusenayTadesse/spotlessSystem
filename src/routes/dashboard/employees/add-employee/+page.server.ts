import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { staffSchema } from '$lib/zodschemas/appointmentSchema';
import { db } from '$lib/server/db';
import { staffTypes as positions, salaries, employee } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(staffSchema));

	const allPositions = await db
		.select({
			value: positions.id,
			name: positions.name,
			description: positions.description
		})
		.from(positions);

	const allStaff = await db
		.select({
			name: employee.firstName
		})
		.from(employee);

	return {
		form,
		allPositions,
		allStaff
	};
};

// import fs from 'node:fs';
// import path from 'node:path';
// import { generateUserId } from '$lib/global.svelte';
// import { Readable } from 'node:stream';
// import { pipeline } from 'node:stream/promises';
// import { env } from '$env/dynamic/private';
// import { setFlash } from 'sveltekit-flash-message/server';
// const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

// if (!fs.existsSync(FILES_DIR)) {
// 	fs.mkdirSync(FILES_DIR, { recursive: true });
// }
//

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	addStaff: async ({ request, locals }) => {
		console.log('connected');
		const form = await superValidate(request, zod4(staffSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { firstName, lastName, email, phone, position, salary, hiredAt, contract, govId } =
			form.data;

		try {
			const imageName = await saveUploadedFile(govId);

			const contractName = await saveUploadedFile(contract);

			const [staffMember] = await db
				.insert(employee)
				.values({
					firstName,
					lastName,
					email,
					phone,
					govtId: imageName,
					contract: contractName,
					type: position,
					hireDate: new Date(hiredAt),
					createdBy: locals.user?.id,
					branchId: locals.user?.branch
				})
				.$returningId();

			await db.insert(salaries).values({
				amount: salary,
				staffId: staffMember.id,
				createdBy: locals.user?.id,
				branchId: locals.user?.branch
			});

			delete form.data.govId;
			delete form.data.contract;
			return message(form, { type: 'success', text: 'Staff Successfully Added' });
		} catch (err) {
			return message(form, { type: 'error', text: `Error: ${err.message}` });
		}
	}
};
