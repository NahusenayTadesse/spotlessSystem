<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editSupply } from '$lib/ZodSchema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Pencil, Save, History } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import SingleView from '$lib/components/SingleView.svelte';
	import Delete from '$lib/forms/Delete.svelte';

	let singleTable = $derived([
		{ name: 'Name', value: data.supply?.name },
		{ name: 'Cost Per Unit', value: data.supply?.costPerUnit },
		{ name: 'Available Quantity', value: data.supply?.quantity },
		{ name: 'Unit of Measurement', value: data.supply?.unitOfMeasure },
		{ name: 'Product Description', value: data.supply?.description },
		{ name: 'Reorder Notification Quantity', value: data.supply?.reorderLevel },
		{ name: 'Product Supplier', value: data.supply?.supplier },
		{ name: 'Added On', value: data.supply?.createdAt },
		{ name: 'Added By', value: data.supply?.createdBy },
		{ name: 'Total costs until now', value: data.supply?.paidAmount + ' Birr costs in transaction' }
	]);

	const { form, errors, enhance, delayed, capture, restore, message } = superForm(data.form, {
		validators: zod4Client(editSupply),
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

	(($form.supplyName = data.supply?.name),
		($form.description = data.supply?.description),
		($form.supplyId = data.supply.id),
		($form.costPerUnit = data.supply.costPerUnit),
		($form.quantity = data.supply.quantity),
		($form.reorderLevel = data.supply.reorderLevel),
		($form.supplier = data.supply.supplier),
		($form.unitOfMeasure = data.supply.unitOfMeasure));

	export const snapshot: Snapshot = { capture, restore };

	//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));
	import Adjustment from '$lib/forms/Adjustment.svelte';
	import { getCurrentMonthRange } from '$lib/global.svelte.js';

	let edit = $state(false);
</script>

<svelte:head>
	<title>Supply Details</title>
</svelte:head>

<SingleView title="Supply Details">
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
		<Delete redirect="/dashboard/supplies" />
		<Adjustment data={data.adjustForm} name={data.supply?.name} />
		<Button href="/dashboard/supplies/{data.supply.id}/ranges/{getCurrentMonthRange()}">
			<History /> See Change History
		</Button>
	</div>
	{#if edit === false}
		<div class="w-full p-4"><SingleTable {singleTable} /></div>
	{/if}
	{#if edit}
		<div class="w-full p-4">
			<form action="?/editSupply" use:enhance class="flex flex-col gap-4" id="edit" method="post">
				{@render fe('Supply Name', 'supplyName', 'text', 'Enter Supply Name', true)}

				<div class="flex w-full flex-col justify-start gap-2">
					<Label for="notes">Supply Description</Label>

					<Textarea
						name="description"
						placeholder="Enter product description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>
				{@render fe(
					'Quantity',
					'quantity',
					'number',
					'Enter the number of items the product currently has',
					true,
					'0'
				)}
				{@render fe('Supplier', 'supplier', 'text', 'Enter the supplier of the product')}
				{@render fe(
					'Unit of Measurement',
					'unitOfMeasure',
					'text',
					'Enter Unit of Measurement',
					true
				)}

				{@render fe(
					'Reorder Notify Level',
					'reorderLevel',
					'number',
					'Enter when you want to be notified'
				)}
				{@render fe('Cost per unit', 'costPerUnit', 'number', 'Cost Per Unit')}

				<input hidden name="supplyId" value={data.supply.id} />
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
