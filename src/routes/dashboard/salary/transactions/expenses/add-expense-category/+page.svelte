<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from '@sveltejs/kit';
	import { positionSchema } from '$lib/ZodSchema.js';
	import DataTable from '$lib/components/Table/data-table.svelte';
	import { columns } from '$lib/components/CategoryColumns.js';

	let { data } = $props();

	const { form, errors, delayed, enhance, capture, restore, message } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(positionSchema)
	});

	export const snapshot: Snapshot = { capture, restore };

	let search = true;

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

<div class="grid grid-cols-1 justify-between gap-16 lg:grid-cols-2">
	<div class="my-8 flex flex-col gap-2">
		<DataTable data={data.allCategories} {columns} {search} />
	</div>

	<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Add New Expense Type</Card.Title>
		</Card.Header>
		<Card.Content>
			<form use:enhance action="?/addExpensesType" class="flex flex-col gap-4" method="post">
				{@render fe('Type Name', 'name', 'text', 'Enter Type Name', true)}

				<div>
					<Label for="description">Type Description</Label>

					<Textarea
						name="description"
						required
						placeholder="Enter type description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>

				<Button type="submit" class="mt-4">
					{#if $delayed}
						<LoadingBtn name="Adding Expense Type" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Expense Type
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
