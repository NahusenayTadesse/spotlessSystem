import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { add } from './schema';
import { db } from '$lib/server/db';
import { salaries, employee } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import { departments, empStatus, eduLevel } from '$lib/server/fastData';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(add));

	const departmentList = await departments();
	const empStatusList = await empStatus();
	const eduLevelList = await eduLevel();

	return {
		form,

		departmentList,
		empStatusList,
		eduLevelList
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
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const {
			name,
			fatherName,
			grandFatherName,
			email,
			phone,
			departmentId,
			salary,
			hireDate,
			govId
		} = form.data;

		try {
			const imageName = await saveUploadedFile(govId);

			const contractName = await saveUploadedFile(contract);

			const [staffMember] = await db
				.insert(employee)
				.values({
					name,
					lastName,
					email,
					phone,
					govtId: imageName,
					contract: contractName,
					type: position,
					hireDate: new Date(hiredAt),
					createdBy: locals.user?.id
				})
				.$returningId();

			await db.insert(salaries).values({
				amount: salary,
				staffId: staffMember.id,
				createdBy: locals.user?.id
			});

			delete form.data.govId;
			delete form.data.contract;
			return message(form, { type: 'success', text: 'Staff Successfully Added' });
		} catch (err) {
			return message(form, { type: 'error', text: `Error: ${err?.message}` });
		}
	}
};
