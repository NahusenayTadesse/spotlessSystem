<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editStaff } from '$lib/zodschemas/appointmentSchema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { fileProxy, superForm } from 'sveltekit-superforms/client';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Pencil, Plus, Save, Trash } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	import DatePicker2 from '$lib/formComponents/DatePicker2.svelte';
	import { fly } from 'svelte/transition';
	import Delete from '$lib/forms/Delete.svelte';
	import DataTable from '$lib/components/Table/data-table.svelte';
	import { commissionProduct, commissionService, overtime } from './columns.js';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
	import SingleView from '$lib/components/SingleView.svelte';

	let singleTable = $derived([
		{ name: 'Name', value: `${data.staffMember?.firstName} ${data.staffMember?.lastName}` },
		{ name: 'Position', value: data.staffMember.category },

		{ name: 'Hired On', value: data.staffMember?.hireDate },
		{ name: 'Added By', value: data.staffMember?.addedBy },
		{
			name: 'Current Salary',
			value: data.staffMember?.salary === null ? 'Not Added Yet' : data.staffMember?.salary + ' ETB'
		},
		{ name: 'Goverment Id', value: data.staffMember?.govId },
		{ name: 'Contract', value: data.staffMember?.contract }
	]);

	const { form, errors, enhance, delayed, capture, restore } = superForm(data.form, {
		validators: zod4Client(editStaff),
		resetForm: false
	});

	$form.staffId = data.staffMember.id;

	$form.firstName = data.staffMember.firstName;
	$form.lastName = data.staffMember.lastName;
	$form.position = data.staffMember.categoryId;
	$form.phone = data.staffMember.phone;
	$form.email = data.staffMember.email;
	$form.salary = data.staffMember?.salary;
	$form.hiredAt = data.staffMember.hireDate;

	export const snapshot: Snapshot = { capture, restore };

	let edit = $state(false);
	let search = false;

	const govId = fileProxy(form, 'govId');
	const contract = fileProxy(form, 'contract');

	let govtId = $state(false);
	let contractPdf = $state(false);
</script>

<svelte:head>
	<title>Staff Details</title>
</svelte:head>

<SingleView title="Staff Details">
	<div class="mt-4 flex w-full flex-row items-start justify-start gap-2 pl-4">
		<Button onclick={() => (edit = !edit)}>
			{#if !edit}
				<Pencil class="h-4 w-4" />
				Edit
			{:else}
				<ArrowLeft class="h-4 w-4" />

				Back
			{/if}
		</Button>
		<Delete redirect="/dashboard/staff" />
	</div>
	{#if edit === false}
		<div class="w-full p-4"><SingleTable {singleTable} /></div>
	{/if}
	{#if edit}
		<div class="w-full p-4">
			<form
				use:enhance
				action="?/editStaff"
				id="main"
				class="flex flex-col gap-4"
				method="POST"
				enctype="multipart/form-data"
			>
				<div class="flex flex-row gap-2">
					{@render fe('First Name', 'firstName', 'text', "Enter Staff's First Name", true)}
					{@render fe('Last Name', 'lastName', 'text', "Enter Staff's last Name", true)}
				</div>

				{@render selects('position', data?.categories)}

				{@render fe('Phone', 'phone', 'tel', 'Enter Phone Number', true)}

				{@render fe('Email', 'email', 'email', 'Enter Email', true)}
				{@render fe('Salary', 'salary', 'number', 'Enter Salary', true)}

				<div class="flex w-full flex-col justify-start gap-2">
					<Label for="hiredAt" class="capitalize">Hired On</Label>

					<DatePicker2 bind:data={$form.hiredAt} />

					{#if $errors.hiredAt}<span class="text-red-500">{$errors.hiredAt}</span>{/if}
					<input type="text" name="hiredAt" bind:value={$form.hiredAt} />
				</div>

				{#if govtId === false && data.staffMember?.govId}
					<div class="relative">
						<button
							onclick={() => {
								govtId = true;
							}}
							type="button"
							title="Replace Gov't ID"><Trash class="absolute top-0 right-0" /></button
						>
						<img
							src="/dashboard/files/{data.staffMember?.govId}"
							alt=""
							srcset=""
							transition:fly={{ x: -200, duration: 300 }}
						/>
					</div>
				{/if}

				{#if govtId || data.staffMember?.govId === null}
					<div
						class="relative flex w-full flex-col justify-start gap-2"
						transition:fly={{ x: -200, duration: 300 }}
					>
						<button
							onclick={() => {
								govtId = false;
							}}
							type="button"
							title="Replace Gov't ID"
						>
							<Trash class="absolute top-0 right-0" /></button
						>

						<Label for="govId" class="capitalize">Upload new staff member Goverment Id</Label>
						<Input
							type="file"
							name="govId"
							accept="image/*,application/pdf"
							bind:files={$govId}
							multiple={false}
						/>
						{#if $errors.govId}
							<span>{$errors.govId}</span>
						{/if}
					</div>
				{/if}

				{#if contractPdf === false && data.staffMember?.contract}
					{#if data.staffMember?.contract?.endsWith('.pdf')}
						<div class="relative">
							<button
								onclick={() => {
									contractPdf = true;
								}}
								type="button"
								title="Replace Contract"><Trash class="absolute top-0 right-0" /></button
							>

							<object
								data="/dashboard/files/{data.staffMember?.contract}"
								type="application/pdf"
								width="100%"
								height="600px"
								title="Contract for {$form.firstName} {$form.lastName}"
								transition:fly={{ x: -200, duration: 300 }}
							>
								<p>
									Your browser does not support PDFs.
									<a
										href="/dashboard/files/{$form.contract}"
										download="{$form.firstName} {$form.lastName} Contract PDF">Download the PDF</a
									>.
								</p>
							</object>
						</div>
					{/if}
				{/if}

				{#if contractPdf || data.staffMember?.contract === null}
					<div
						class="relative flex w-full flex-col justify-start gap-2"
						transition:fly={{ x: -200, duration: 300 }}
					>
						<button
							onclick={() => {
								contractPdf = false;
							}}
							type="button"
							title="Replace Contract"><Trash class="absolute top-0 right-0" /></button
						>

						<Label for="contract" class="capitalize">Upload new staff member Contract</Label>
						<Input
							type="file"
							name="contract"
							accept="image/*,application/pdf"
							bind:files={$contract}
							multiple={false}
						/>
						{#if $errors.govId}
							<span>{$errors.govId}</span>
						{/if}
					</div>
				{/if}
				<input type="hidden" name="staffId" bind:value={$form.staffId} />
				<Button type="submit" class="mt-4" form="main">
					{#if $delayed}
						<LoadingBtn name="Saving Changes" />
					{:else}
						<Save class="h-4 w-4" />

						Save Changes
					{/if}
				</Button>
			</form>
		</div>
	{/if}
</SingleView>
<div class="my-8 w-4/5 lg:w-1/2">
	<DateMonth id={data.staffMember?.id} link="/dashboard/staff" />

	<div class="mb-6">
		<h3 class="text-lg font-semibold">Product Commissions</h3>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			Commissions earned from product sales by {data?.staffMember?.firstName}
			{data?.staffMember?.lastName}.
		</p>
		<DataTable data={data.productCommissions} columns={commissionProduct} search={false} />
	</div>

	<div class="mb-6">
		<h3 class="text-lg font-semibold">Service Commissions</h3>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			Commissions earned from services performed by {data?.staffMember?.firstName}
			{data?.staffMember?.lastName}.
		</p>
		<DataTable data={data.serviceCommissions} columns={commissionService} search={false} />
	</div>

	<div class="mb-6">
		<h3 class="text-lg font-semibold">Overtime Records</h3>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			Logged overtime shifts and corresponding pay.
		</p>
		<DataTable data={data.staffOvertime} columns={overtime} search={false} />
	</div>

	<div class="mb-6">
		<h3 class="text-lg font-semibold">Deductions</h3>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			Salary deductions applied to {data?.staffMember?.firstName}
			{data?.staffMember?.lastName}.
		</p>
		<DataTable data={data.staffDeductions} columns={overtime} search={false} />
	</div>

	<div class="mb-6">
		<h3 class="text-lg font-semibold">Bonuses</h3>
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			Bonuses awarded to {data?.staffMember?.firstName}
			{data?.staffMember?.lastName}.
		</p>
		<DataTable data={data.staffBonuses} columns={overtime} search={false} />
	</div>
</div>

{#snippet fe(
	label = '',
	name = '',
	type = '',
	placeholder = '',
	required = false,
	min = '',
	max = ''
)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name}>{label}</Label>
		<Input
			{type}
			{name}
			{placeholder}
			{required}
			{min}
			{max}
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
		/>
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}
{#snippet selects(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}
