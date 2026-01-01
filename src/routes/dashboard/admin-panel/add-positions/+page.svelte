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
	import ChildrenTable from '$lib/ChildrenTable.svelte';

	let { data } = $props();

	const { form, errors, delayed, enhance, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(positionSchema)
	});

	export const snapshot: Snapshot = { capture, restore };

	let tableHeaders = [
		{ name: 'Id', key: 'id' },
		{ name: 'Name', key: 'name' },
		{ name: 'Description', key: 'description' }
	];
	let search = true;
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
		<ChildrenTable mainlist={data.allPositions} {tableHeaders} {search} link="positions" />
	</div>

	<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Add New Positions for Staff</Card.Title>
		</Card.Header>
		<Card.Content>
			<form use:enhance action="?/addPosition" class="flex flex-col gap-4" method="post">
				{@render fe('Position Name', 'name', 'text', 'Enter Position Name', true)}

				<div>
					<Label for="description">Position Description</Label>

					<Textarea
						name="description"
						required
						placeholder="Enter position description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>

				<Button type="submit" class="mt-4">
					{#if $delayed}
						<LoadingBtn name="Adding Position" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Position
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
