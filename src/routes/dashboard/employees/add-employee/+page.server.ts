import { superValidate, message, setError } from 'sveltekit-superforms';
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

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	add: async ({ request, locals }) => {
		console.log('connected');
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const {
			idNo,
			name,
			fatherName,
			grandFatherName,
			birthDate,
			email,
			phone,
			departmentId,
			salary,
			hireDate
		} = form.data;

		const bDay = isUnder18(new Date(birthDate));

		if (bDay) {
			setError(form, 'birthDate', 'Employee must be at least 18 years old');
		}
		try {
			// const imageName = await saveUploadedFile(govId);

			// const contractName = await saveUploadedFile(contract);

			const [staffMember] = await db
				.insert(employee)
				.values({
					idNo,
					name,
					fatherName,
					grandFatherName,
					email,
					phone,

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
function isUnder18(birthDate: Date): boolean {
	const birth = new Date(birthDate);
	const today = new Date();

	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();
	const dayDiff = today.getDate() - birth.getDate();

	// Adjust age if birthday hasn't occurred yet this year
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age < 18;
}
