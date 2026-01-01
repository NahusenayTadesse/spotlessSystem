<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editService } from '$lib/ZodSchema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Pencil, Save } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { minutesToHoursString } from '$lib/global.svelte';
	import Delete from '$lib/forms/Delete.svelte';
	import SingleView from '$lib/components/SingleView.svelte';

	let singleTable = $derived([
		{ name: 'Name', value: data.service?.name },
		{ name: 'Category', value: data.service.category },
		{ name: 'Price', value: data.service?.price + ' ETB' },
		{ name: 'Service Description', value: data.service?.description },
		{ name: 'Service Commission', value: data.service?.commission },
		{ name: 'Service Duration', value: minutesToHoursString(data.service?.duration) },
		{ name: 'Started On', value: data.service?.createdAt },
		{ name: 'Added By', value: data.service?.createdBy },
		{
			name: 'Sales in Money',
			value: data.service?.saleCount === null ? '0 ETB in Transactions' : ' ETB in Transactions'
		}
	]);

	const { form, errors, enhance, delayed, capture, restore, message } = superForm(data.form, {
		validators: zod4Client(editService),
		resetForm: false
	});

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

	(($form.serviceName = data.service.name),
		($form.category = data.service.categoryId),
		($form.commission = data.service.commission),
		($form.description = data.service.description),
		($form.serviceId = data.service.id),
		($form.price = data.service.price),
		($form.durationMinutes = data.service?.duration));

	export const snapshot: Snapshot = { capture, restore };

	//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));

	let edit = $state(false);

	let search = false;
</script>

<svelte:head>
	<title>Sales Details</title>
</svelte:head>

<SingleView title="Service Details">
	<div class="mt-4 flex w-full flex-row items-start justify-start gap-4 pl-4">
		<Button onclick={() => (edit = !edit)}>
			{#if !edit}
				<Pencil class="h-4 w-4" />
				Edit
			{:else}
				<ArrowLeft class="h-4 w-4" />

				Back
			{/if}
		</Button>
		<Delete redirect="/dashboard/services" />
	</div>
	{#if edit === false}
		<div class="w-full p-4"><SingleTable {singleTable} /></div>
	{/if}
	{#if edit}
		<div class="w-full p-4">
			<form action="?/editProduct" use:enhance class="flex flex-col gap-4" id="edit" method="post">
				{@render fe('Service Name', 'serviceName', 'text', 'Enter Service Name', true)}
				{@render selects('category', data?.categories)}

				<div class="flex w-full flex-col justify-start gap-2">
					<Label for="notes">Service Description (optional)</Label>

					<Textarea
						name="description"
						placeholder="Enter added product description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>
				{@render fe(
					'Duration of Service in minutes',
					'durationMinutes',
					'number',
					'Enter the average number of minutes it takes to complete service',
					true,
					'0'
				)}
				{@render fe('Price', 'price', 'number', 'Enter the price of item', true, '0')}
				{@render fe('Commission', 'commission', 'number', 'Add Service Commision', true)}

				<input hidden name="serviceId" value={data.service.id} />
				<Button form="edit" type="submit" class="mt-4">
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
