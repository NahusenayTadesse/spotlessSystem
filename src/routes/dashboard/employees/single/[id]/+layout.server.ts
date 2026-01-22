import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	employmentStatuses,
	employee,
	user,
	department,
	address,
	subcity,
	educationalLevel,
	staffFamilies,
	qualification,
	workExperience,
	employeeGuarantor as eg,
	staffSchedule,
	staffContacts,
	staffAccounts,
	paymentMethods
} from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
	const { id } = params;

	const form = await superValidate(zod4(schema));

	const staffMember = await db
		.select({
			id: employee.id,
			idNo: employee.idNo,
			firstName: employee.name,
			fatherName: employee.fatherName,
			grandFatherName: employee.grandFatherName,
			gender: employee.gender,
			nationality: employee.nationality,
			religion: employee.religion,
			bloodType: employee.bloodType,
			tinNo: employee.tinNo,
			department: department.name,
			departmentId: department.id,
			status: employmentStatuses.name,
			statusId: employmentStatuses.id,
			address: employee.address,
			birthDate: employee.birthDate,
			age: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.birthDate}, CURDATE())`,
			educationalLevel: educationalLevel.name,
			educationalLevelId: educationalLevel.id,
			maritalStatus: employee.martialStatus,
			hireDate: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`,
			photo: employee.photo,
			govId: employee.govtId,
			isActive: employee.isActive,
			addedBy: user.name,
			updatedBy: user.name,
			leavesLeft: employee.leavesLeft,
			terminationDate: employee.terminationDate,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`
		})
		.from(employee)
		.leftJoin(department, eq(employee.departmentId, department.id))
		.leftJoin(employmentStatuses, eq(employee.employmentStatus, employmentStatuses.id))
		.leftJoin(educationalLevel, eq(employee.educationalLevel, educationalLevel.id))
		.leftJoin(user, eq(employee.createdBy, user.id))
		.where(eq(employee.id, Number(id)))
		.then((rows) => rows[0]);
	if (!staffMember) {
		throw error(404, 'Staff member not found');
	}

	let employeeAddress = await db
		.select({
			id: address.id,
			street: address.street,
			subcity: subcity.name,
			subcityId: subcity.id,
			kebele: address.kebele,
			buildingNumber: address.buildingNumber,
			floor: address.floor,
			houseNumber: address.houseNumber,
			status: address.status
		})
		.from(address)
		.leftJoin(subcity, eq(address.subcityId, subcity.id))
		.where(eq(address.id, Number(staffMember.address)))
		.then((rows) => rows[0]);

	let employeeFamily = await db
		.select({
			id: staffFamilies.id,
			name: staffFamilies.name,
			gender: staffFamilies.gender,
			phone: staffFamilies.phone,
			email: staffFamilies.email,
			relationShip: staffFamilies.relationship, // Note: watch for casing (relationShip vs relationship)
			otherRelationShip: staffFamilies.otherRelationship,
			emergencyContact: staffFamilies.emergencyContact,
			status: staffFamilies.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(staffFamilies)
		.leftJoin(user, eq(staffFamilies.createdBy, user.id))
		.where(eq(staffFamilies.staffId, Number(id)))
		.orderBy(desc(staffFamilies.emergencyContact));

	let employeeQualification = await db
		.select({
			id: qualification.id,
			field: qualification.field,
			educationalLevel: educationalLevel.name,
			educationalLevelId: educationalLevel.id,
			schoolName: qualification.schoolName,
			graduationDate: qualification.graduationDate,
			certificate: qualification.certificate,
			addedBy: user.name,
			addedById: user.id
		})
		.from(qualification)
		.leftJoin(user, eq(qualification.createdBy, user.id))
		.leftJoin(educationalLevel, eq(qualification.educationLevel, educationalLevel.id))
		.where(eq(qualification.staffId, Number(id)));

	let employeeWorkExperience = await db
		.select({
			id: workExperience.id,
			companyName: workExperience.companyName,
			position: workExperience.position,
			startDate: workExperience.startDate,
			endDate: workExperience.endDate,
			certificate: workExperience.certificate,
			description: workExperience.description,
			addedBy: user.name,
			addedById: user.id
		})
		.from(workExperience)
		.leftJoin(user, eq(workExperience.createdBy, user.id))
		.where(eq(workExperience.staffId, Number(id)))
		.orderBy(desc(workExperience.endDate));

	let employeeGarantor = await db
		.select({
			id: eg.id,
			name: eg.name,
			relationShip: eg.relationship,
			relation: eg.relation,
			jobType: eg.jobType,
			company: eg.company,
			salary: eg.salary,
			document: eg.gurantorDocument,
			phone: eg.phone,
			email: eg.email,
			govtId: eg.govtId,
			photo: eg.photo,
			address: {
				id: address.id,
				street: address.street,
				subcity: subcity.name,
				subcityId: subcity.id,
				kebele: address.kebele,
				buildingNumber: address.buildingNumber,
				floor: address.floor,
				houseNumber: address.houseNumber,
				status: address.status
			},
			status: address.status,
			addedBy: user.name
		})
		.from(eg)
		.leftJoin(address, eq(address.id, eg.address))
		.leftJoin(subcity, eq(subcity.id, address.subcityId))
		.leftJoin(user, eq(user.id, eg.createdBy))
		.where(eq(eg.staffId, Number(id)))
		.then((rows) => rows[0]);

	let schedule = await db
		.select({
			id: staffSchedule.id,
			day: staffSchedule.weekDay,
			startTime: staffSchedule.startTime,
			endTime: staffSchedule.endTime,
			status: staffSchedule.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(staffSchedule)
		.leftJoin(user, eq(staffSchedule.createdBy, user.id))
		.where(eq(staffSchedule.staffId, Number(id)));

	let contacts = await db
		.select({
			id: staffContacts.id,
			contactType: staffContacts.contactType,
			contactDetail: staffContacts.contactDetail,
			status: staffContacts.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(staffContacts)
		.leftJoin(user, eq(staffContacts.createdBy, user.id))
		.where(eq(staffContacts.staffId, Number(id)));

	let accounts = await db
		.select({
			id: staffAccounts.id,
			paymentMethod: paymentMethods.name,
			accountDetail: staffAccounts.accountDetail,
			paymentMethodId: staffAccounts.paymentMethodId,
			status: staffAccounts.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(staffAccounts)
		.leftJoin(user, eq(staffAccounts.createdBy, user.id))
		.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
		.where(eq(staffAccounts.staffId, Number(id)));

	return {
		staffMember,
		address: employeeAddress,
		family: employeeFamily,
		qualifications: employeeQualification,
		experience: employeeWorkExperience,
		guarantor: employeeGarantor,
		contacts,
		schedule,
		accounts,
		form
	};
};
