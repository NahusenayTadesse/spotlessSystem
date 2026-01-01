<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { staffSchema } from '$lib/zodschemas/appointmentSchema';
	import { fileProxy, superForm } from 'sveltekit-superforms/client';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import DatePicker2 from '$lib/formComponents/DatePicker2.svelte';

	let { data } = $props();
	const { form, errors, enhance, message, delayed, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(staffSchema)
	});
	const govId = fileProxy(form, 'govId');
	const contract = fileProxy(form, 'contract');

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
	let date = new Date();

	$form.hiredAt = date.toLocaleDateString('en-CA');
</script>

<svelte:head>
	<title>Add New Staff</title>
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

<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
	<Card.Header>
		<Card.Title class="text-2xl">Add New Staff Member</Card.Title>
	</Card.Header>
	<Card.Content>
		<form
			use:enhance
			action="?/addStaff"
			id="main"
			class="flex flex-col gap-4"
			method="POST"
			enctype="multipart/form-data"
		>
			<div class="flex flex-row gap-2">
				{@render fe('First Name', 'firstName', 'text', "Enter Staff's First Name", true)}
				{@render fe('Last Name', 'lastName', 'text', "Enter Staff's last Name", true)}
			</div>

			{@render selects('position', data?.allPositions)}

			{@render fe('Phone', 'phone', 'tel', 'Enter Phone Number', true)}

			{@render fe('Email', 'email', 'email', 'Enter Email', true)}
			{@render fe('Salary', 'salary', 'number', 'Enter Salary', true)}
			<div class="flex w-full flex-col justify-start gap-2">
				<Label for="hiredAt" class="capitalize">Hired On</Label>

				<DatePicker2 bind:data={$form.hiredAt} />

				{#if $errors.hiredAt}<span class="text-red-500">{$errors.hiredAt}</span>{/if}
				<input type="text" name="hiredAt" bind:value={$form.hiredAt} />
			</div>

			<div class="flex w-full flex-col justify-start gap-2">
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

			<div class="flex w-full flex-col justify-start gap-2">
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

			<Button type="submit" class="mt-4" form="main">
				{#if $delayed}
					<LoadingBtn name="Adding Staff" />
				{:else}
					<Plus class="h-4 w-4" />

					Add Staff
				{/if}
			</Button>
		</form>
	</Card.Content>
</Card.Root>
