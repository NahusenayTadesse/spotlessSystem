<script lang="ts">
	import type { Snapshot } from '@sveltejs/kit';
	import { ExternalLink, Plus } from '@lucide/svelte';
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

	const sectionStyle = `flex flex-col gap-4 my-4`;
	const rowStyle = `grid grid-cols-3 mt-4  gap-4`;
</script>

<svelte:head>
	<title>Add New Employee</title>
</svelte:head>

<FormCard title="Add New Employee" className="lg:w-full!">
	<!-- EmployeeAddForm.svelte -->

	<form
		use:enhance
		action="?/add"
		id="main"
		method="POST"
		enctype="multipart/form-data"
		class="grid-form"
	>
		<!-- 1. PERSONAL INFO -->
		<section class={sectionStyle}>
			<h4>Personal Information</h4>

			{#if $message?.existingId}
				<Button
					class="w-48"
					target="_blank"
					href="/dashboard/employees/single/{$message.existingId}"
				>
					<ExternalLink /> View Existing Profile</Button
				>
				<Input
					label="Verify Employee's Identity"
					name="newEmployeeVerified"
					{form}
					{errors}
					type="checkboxSingle"
					placeholder="This is Employee is new and register them."
				/>
			{/if}

			<div class={rowStyle}>
				<Input
					label="Name"
					name="name"
					{form}
					placeholder="Enter Name"
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
				<Input label="Email" name="email" placeholder="Enter Email" {form} {errors} type="email" />
				<Input label="Nationality" name="nationality" {form} {errors} type="text" />
				<Input
					label="Blood Type"
					name="bloodType"
					{form}
					{errors}
					type="select"
					items={bloodTypes}
				/>
				<Input
					label="Birth Date"
					name="birthDate"
					year
					{form}
					{errors}
					type="date"
					required
					futureDays
				/>
				<Input
					label="Marital Status"
					name="martialStatus"
					{form}
					{errors}
					type="select"
					items={maritalStatuses}
				/>
			</div>

			<h4>Address</h4>

			<div class={rowStyle}>
				<Input
					label="Subcity"
					name="subcity"
					type="combo"
					{form}
					{errors}
					required
					items={data?.subcityList}
				/>
				<Input label="Street" name="street" type="text" {form} {errors} required />
				<Input label="Kebele" name="kebele" type="text" {form} {errors} required />
				<Input
					label="Building Name or Number"
					name="buildingNumber"
					type="text"
					{form}
					{errors}
					required
				/>
				<Input label="Floor" name="floor" type="number" {form} {errors} required />
				<Input label="House Number" name="houseNumber" type="text" {form} {errors} required />
				<Input
					label="Status"
					name="status"
					type="select"
					{form}
					{errors}
					required
					items={[
						{ value: true, name: 'Active' },
						{ value: false, name: 'Inactive' }
					]}
				/>
			</div>
		</section>

		<!-- 2. GOVERNMENT / LEGAL -->
		<section class={sectionStyle}>
			<h4>Government & Legal</h4>
			<div class={rowStyle}>
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
					label="Government ID"
					name="govtId"
					{form}
					{errors}
					type="file"
					required
					placeholder="Upload a FIDA or A recent ID of Employee"
				/>
				<Input
					label="Photo"
					name="photo"
					{form}
					{errors}
					type="file"
					required
					placeholder="Upload a recent photo of Employee 4 X 4 with good Quality, Max 10MB"
				/>
			</div>
		</section>

		<!-- 3. JOB DETAILS -->
		<section class={sectionStyle}>
			<h4>Job Details</h4>
			<div class={rowStyle}>
				<Input
					label="Department"
					name="departmentId"
					{form}
					{errors}
					type="select"
					items={data?.departmentList}
					required
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
				<Input
					label="Site"
					name="site"
					{form}
					{errors}
					type="select"
					items={data?.siteList}
					required
				/>
				<Input
					label="Hire Date"
					name="hireDate"
					year
					{form}
					{errors}
					type="date"
					required
					oldDays
					futureDays={false}
				/>
			</div>

			<div class={rowStyle}>
				<Input
					label="Educational Level"
					name="educationalLevel"
					{form}
					{errors}
					type="select"
					items={data?.eduLevelList}
				/>
				<Input label="Salary (ETB)" name="salary" {form} {errors} type="number" required />
				<Input
					label="Tranport Allowance (ETB)"
					name="transportAllowance"
					{form}
					{errors}
					type="number"
					required
				/>
			</div>
			<div class={rowStyle}>
				<Input
					label="Housing Allowance (ETB)"
					name="housingAllowance"
					{form}
					{errors}
					type="number"
					required
				/>
				<Input
					label="Non Tax Allowance (ETB)"
					name="nonTaxAllowance"
					{form}
					{errors}
					type="number"
					required
				/>

				<Input
					label="Positional Allowance (ETB)"
					name="positionAllowance"
					{form}
					{errors}
					type="number"
					required
				/>
			</div>
		</section>

		<!-- 4. PAYROLL -->
		<!-- <section class={sectionStyle}>
			<h4>Payroll Settings</h4>
			<div class={rowStyle}>
				<Input
					label="Pension (%)"
					name="pensionType"
					{form}
					{errors}
					type="select"
					items={[
						{ value: '1', name: 'Employee Pension Contribution (7%)' },
						{ value: '1', name: 'Employer Pension Contribution (11%)' }
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
			</div>
		</section> -->

		<!-- 5. SUBMIT -->
		<section class={sectionStyle}>
			<Errors allErrors={$allErrors} />
			<Button type="submit" form="main">
				{#if $delayed}
					<LoadingBtn name="Adding Employee" />
				{:else}
					<Plus class="h-4 w-4" />
					Add Employee
				{/if}
			</Button>
		</section>
	</form>
</FormCard>
