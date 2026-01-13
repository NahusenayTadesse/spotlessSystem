<script lang="ts">
	import type { Snapshot } from '@sveltejs/kit';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { add } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import FormCard from '$lib/formComponents/FormCard.svelte';
	import Input from '$lib/formComponents/InputComp.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';

	let { data } = $props();
	const { form, errors, enhance, message, delayed, capture, restore, allErrors } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(add)
		}
	);

	export const snapshot: Snapshot = { capture, restore };
	import { toast } from 'svelte-sonner';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});
	// 	 function getItemNameById(items: any, value: any) {
	//   const item = items.find(i=> i.value === value);
	//   return item ? item.name : null; // returns null if not found
	// }
	//
	const genders = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' }
	];

	const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((v) => ({
		value: v,
		name: v
	}));

	const maritalStatuses = ['single', 'married', 'widowed', 'divorced', 'other'].map((v) => ({
		value: v,
		name: v.charAt(0).toUpperCase() + v.slice(1)
	}));
</script>

<svelte:head>
	<title>Add New Employee</title>
</svelte:head>

<FormCard title="Add New Employee">
	<Errors allErrors={$allErrors} />
	<form
		use:enhance
		action="?/add"
		id="main"
		class="flex flex-col gap-4"
		method="POST"
		enctype="multipart/form-data"
	>
		<Input
			label="Employee ID"
			name="idNo"
			{form}
			placeholder="Enter Employee ID"
			{errors}
			type="text"
			required
		/>
		<Input
			label="Full Name"
			name="name"
			{form}
			placeholder="Enter Full Name"
			{errors}
			type="text"
			required
		/>
		<Input
			label="Father Name"
			name="fatherName"
			{form}
			placeholder="Enter Father Name"
			{errors}
			type="text"
			required
		/>

		<!-- Row 2 -------------------------------------------------------------- -->
		<Input
			label="Grandfather Name"
			name="grandFatherName"
			{form}
			placeholder="Enter Grandfather Name"
			{errors}
			type="text"
			required
		/>
		<Input
			label="Gender"
			name="gender"
			{form}
			placeholder="Select Gender"
			{errors}
			type="select"
			items={genders}
			required
		/>
		<Input
			label="Phone"
			name="phone"
			{form}
			placeholder="Enter Phone Number"
			{errors}
			type="tel"
			required
		/>

		<!-- Row 3 -------------------------------------------------------------- -->
		<Input
			label="Email"
			name="email"
			placeholder="Enter Email"
			{form}
			{errors}
			type="email"
			required={false}
		/>
		<Input label="Nationality" name="nationality" {form} {errors} type="text" />
		<Input
			label="Religion"
			name="religion"
			{form}
			{errors}
			type="select"
			items={[
				{
					value: 'Christian',
					name: 'Christian'
				},
				{ value: 'Muslim', name: 'Muslim' },
				{ value: 'Other', name: 'Other' }
			]}
		/>

		<!-- Row 4 -------------------------------------------------------------- -->
		<Input label="Blood Type" name="bloodType" {form} {errors} type="select" items={bloodTypes} />
		<Input
			label="TIN (10 digits)"
			name="tinNo"
			placeholder="Enter TIN"
			{form}
			{errors}
			type="text"
			required
		/>
		<Input
			label="Department"
			name="departmentId"
			{form}
			{errors}
			type="select"
			items={data?.departmentList}
			required
		/>

		<!-- Row 5 -------------------------------------------------------------- -->
		<Input
			label="Birth Date"
			name="birthDate"
			year={true}
			{form}
			{errors}
			type="date"
			required
			futureDays={true}
		/>
		{$form.birthDate}
		<Input
			label="Pension (%)"
			name="pensionType"
			{form}
			{errors}
			type="select"
			items={[
				{ value: '1', name: 'Employee Pension Contribution (7%)' },
				{
					value: '1',
					name: 'Employer Pension Contribution (11%)'
				}
			]}
			required
		/>
		<Input
			label="Tax Type (%)"
			name="taxType"
			{form}
			{errors}
			type="select"
			items={[
				{ value: '0', name: '0% (Up to 600 ETB)' },
				{ value: '10', name: '10% (601 – 1,650 ETB)' },
				{ value: '15', name: '15% (1,651 – 3,200 ETB)' },
				{ value: '20', name: '20% (3,201 – 5,250 ETB)' },
				{ value: '25', name: '25% (5,251 – 7,800 ETB)' },
				{ value: '30', name: '30% (7,801 – 10,900 ETB)' },
				{ value: '35', name: '35% (Above 10,900 ETB)' }
			]}
			required
		/>

		<!-- Row 6 -------------------------------------------------------------- -->
		<Input label="Salary (ETB)" name="salary" {form} {errors} type="number" required />
		<Input label="Photo" name="photo" {form} {errors} type="file" required />
		<Input label="Government ID" name="govtId" {form} {errors} type="file" required />

		<!-- Row 7 -------------------------------------------------------------- -->
		<Input
			label="Hire Date"
			name="hireDate"
			{form}
			{errors}
			type="date"
			year={true}
			required
			oldDays={true}
			futureDays={true}
		/>
		<Input
			label="Employment Status"
			name="employmentStatus"
			{form}
			{errors}
			type="select"
			items={data?.empStatusList}
			required
		/>

		<!-- Row 8 -------------------------------------------------------------- -->
		<Input
			label="Educational Level"
			name="educationalLevel"
			{form}
			{errors}
			type="select"
			items={data?.eduLevelList}
		/>
		<Input
			label="Marital Status"
			name="martialStatus"
			{form}
			{errors}
			type="select"
			items={maritalStatuses}
		/>
		<Button type="submit" class="mt-4" form="main">
			{#if $delayed}
				<LoadingBtn name="Adding Staff" />
			{:else}
				<Plus class="h-4 w-4" />

				Add Staff
			{/if}
		</Button>
	</form>
</FormCard>
