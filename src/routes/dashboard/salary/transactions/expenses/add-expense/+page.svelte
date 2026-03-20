<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';

	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import DatePicker2 from '$lib/formComponents/DatePicker2.svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus, Upload, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { insertExpenseSchema as expensesSchema } from './expenseSchema';
	import { superForm, fileProxy } from 'sveltekit-superforms/client';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import FileUpload from '$lib/formComponents/FileUpload.svelte';
	import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';

	let { data } = $props();

	const { form, errors, enhance, delayed, message, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(expensesSchema)
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

	const file = fileProxy(form, 'reciept');

	export const snapshot: Snapshot = { capture, restore };
</script>

<svelte:head>
	<title>Add New Expense</title>
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
		<Label for={name} class="capitalize">Expense {name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}

{#snippet date(name, title)}
	<Label for={name} class="capitalize">{title}</Label>

	<DatePicker2 bind:data={$form[name]} oldDays={true} />
	<input type="hidden" {name} bind:value={$form[name]} />
	{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
{/snippet}

{#snippet combo(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<ComboboxComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}
<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
	<Card.Header>
		<Card.Title class="text-2xl">Add an Expense</Card.Title>
		<Card.Description>Add a new expense that is not a sale.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form
			use:enhance
			action="?/addExpense"
			id="main"
			class="flex flex-col gap-4"
			method="post"
			enctype="multipart/form-data"
		>
			{@render date('expenseDate', 'Expense Date')}
			{@render selects('type', data?.categories)}
			{@render combo('paymentMethod', data?.paymentMethod)}

			<div class="flex w-full flex-col justify-start gap-2">
				<Label for="description">Expense Description (optional)</Label>

				<Textarea
					name="description"
					placeholder="Enter added product description"
					bind:value={$form.description}
					aria-invalid={$errors.description ? 'true' : undefined}
				/>

				{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
			</div>
			{@render fe(
				'Amount Fee',
				'total',
				'number',
				'Enter the total amount of the expense',
				true,
				'0'
			)}
			<!-- <div class="my-8 flex w-full flex-col justify-start gap-2">
				{#if !$file.length}
				<Label for="reciept" class="capitalize">Upload Reciept or Screenshot of Sale</Label>{/if}

						<Input
							type="file"
							class=" {$file.length ? 'hidden' : ''} "
							name="receipt"
							accept="image/*,application/pdf"
							bind:files={$file}
							multiple={false}
						/>

					{#if $file?.length}

					<Label for="reciept" class="capitalize">{$file?.item(0).name}</Label>
                  <div class="flex flex-row gap-2">


					   {#if $file[0].type === 'application/pdf'}
					      <iframe src={`${URL.createObjectURL($file[0])}#toolbar=0`} class="w-64 h-64" frameborder="0" title="pdf"></iframe>
					   {:else}
						<img
							src={URL.createObjectURL($file[0])}
							class="h-64 w-64 rounded-md object-cover"
							alt=""
						/>
						{/if}
						<Button variant="ghost" size="icon" onclick={() => (file.set(undefined))}>
							<X class="h-4 w-4" />
						</Button>
						</div>

					{/if}
            </div> -->
			<!-- <div class="flex w-full flex-col justify-start gap-2">
					<Label for="reciept" class="capitalize">Upload Reciept or Screenshot of Booking Fee</Label>
					<div class="relative flex flex-row gap-2">
						<Upload class="absolute top-2 right-16 bottom-0.5 h-6 w-6" />
						<Input
							type="file"
							name="image"
							accept="image/*,application/pdf"
							bind:files={$file}
							multiple={false}
						/>
						<Button
							type="button"
							size="icon"
							variant="outline"
							title="Clear file input"
							onclick={() => ($file = 0)}
						>
							<X />
						</Button>
					</div>
					{#if $errors.reciept}
						<span class="text-red-500">{$errors.reciept}</span>
					{/if}
				</div> -->
			<FileUpload name="reciept" {form} {errors} />
			<!-- {#if $errors.reciept}
						<span class="text-red-500">{$errors.reciept}</span>
					{/if} -->

			<Button type="submit" class="mt-4" form="main">
				{#if $delayed}
					<LoadingBtn name="Adding Expense" />
				{:else}
					<Plus class="h-4 w-4" />
					Add Expense
				{/if}
			</Button>
		</form>
	</Card.Content>
</Card.Root>
