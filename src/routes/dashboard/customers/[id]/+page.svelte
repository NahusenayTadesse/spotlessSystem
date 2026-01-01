<script lang="ts">
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editCustomer } from '$lib/Zodschema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';

	import { ArrowLeft, Pencil, Save } from '@lucide/svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { gender } from '$lib/global.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import Delete from '$lib/forms/Delete.svelte';
	import Empty from '$lib/components/Empty.svelte';
	import SingleView from '$lib/components/SingleView.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';

	let count = $derived(
		(data.customer?.appointmentCount ?? 0) > 1 ? 'Appointments Made' : 'Appointment Made'
	);

	let singleTable = $derived([
		{ name: 'Name', value: data.customer?.firstName + ' ' + data.customer?.lastName },
		{ name: 'Phone', value: data.customer?.phone },
		{ name: 'Gender', value: data.customer?.gender },
		{ name: 'Added By', value: data.customer?.addedBy },
		{ name: 'Added On', value: data.customer?.joinedOn },
		{ name: 'Number of Appointments', value: data.customer?.appointmentCount + ' ' + count },
		{ name: 'Number of Days Since Joined', value: data.customer?.daysSinceJoined + ' Days' }
	]);

	const { form, errors, enhance, delayed, capture, restore, allErrors, message } = superForm(
		data.form,
		{
			validators: zod4Client(editCustomer),
			resetForm: false
		}
	);

	export const snapshot: Snapshot = { capture, restore };

	$form.firstName = data.customer?.firstName;
	$form.lastName = data.customer?.lastName;
	$form.gender = data.customer?.gender;
	$form.phone = data.customer?.phone;

	//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));

	let edit = $state(false);
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
</script>

<svelte:head>
	<title>Customer Details</title>
</svelte:head>

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

{#if data?.customer}
	<SingleView title="Customer Details">
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
			<Delete redirect="/dashboard/customers" />
		</div>
		{#if edit === false}
			<div class="w-full p-4"><SingleTable {singleTable} /></div>
		{:else}
			<form
				action="?/editCustomer"
				use:enhance
				method="post"
				id="edit"
				class="flex w-full flex-col gap-4 p-4"
			>
				<Errors allErrors={$allErrors} />

				{@render fe('Customer First Name', 'firstName', 'text', 'Edit Customer First Name', true)}
				{@render fe('Customer Last Name', 'lastName', 'text', 'Edit Customer Last Name')}
				{@render fe('Customer Phone', 'phone', 'tel;', 'Edit Customer Phone', true)}
				<input type="hidden" value={data.customer?.id} name="customerId" />
				{@render selects('gender', gender)}
				<Button type="submit" class="mt-4" form="edit">
					{#if $delayed}
						<LoadingBtn name="Saving" />
					{:else}
						<Save class="h-4 w-4" />

						Save Changes
					{/if}
				</Button>
			</form>
		{/if}
	</SingleView>
	<!-- {#if data.reciepts?.length}
		<div
			class="mt-4 flex w-full flex-col items-center justify-center
   rounded-md bg-white shadow-lg lg:w-full dark:bg-black dark:shadow-md dark:shadow-gray-900"
		>
			<div
				class="from-dark flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r to-black px-8 py-6 text-white"
			>
				<h1 class="text-center">Booking Fee Paids</h1>
			</div>

			<div class="flex flex-col mt-4 w-full">
		<DataTable data={data.reciepts} {columns} {search}  />

	 </div>
		</div>
	{/if} -->
{:else}
	<Empty title="customer" />
{/if}
