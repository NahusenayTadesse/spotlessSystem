<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';

	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import DatePicker2 from '$lib/formComponents/DatePicker2.svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { overtimeSchema as schema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Errors from '$lib/formComponents/Errors.svelte';
	let { data } = $props();

	import { updateFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';

	const { form, errors, enhance, delayed, allErrors, capture, restore, message } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},
			validators: zod4Client(schema)
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

	$form.hours = 1;
</script>

<svelte:head>
	<title>Add New Overtime</title>
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

{#snippet date(name, title)}
	<Label for={name} class="capitalize">{title}</Label>

	<DatePicker2 bind:data={$form[name]} oldDays={true} />
	<input type="hidden" {name} bind:value={$form[name]} />
	{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
{/snippet}

<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
	<Card.Header>
		<Card.Title class="text-2xl">Add an Overtime for {data.salaryDetail.name}</Card.Title>
	</Card.Header>
	<Card.Content>
		<form use:enhance action="?/addOvertime" id="main" class="flex flex-col gap-4" method="post">
			<Errors allErrors={$allErrors} />

			{@render date('date', 'Overtime Date')}

			{@render fe(
				'Overtime Amount Per Hour',
				'amountPerHour',
				'number',
				'Enter the amount per hour of overtime work',
				true,
				'0'
			)}
			{@render fe(
				'Hours Worked',
				'hours',
				'number',
				'Enter the total amount of hours worked',
				true,
				'0'
			)}

			<div class="flex w-full flex-col justify-start gap-2">
				<Label for="reason">Overtime Reason (optional)</Label>

				<Textarea
					name="reason"
					placeholder="Enter overtime reason"
					bind:value={$form.reason}
					aria-invalid={$errors.reason ? 'true' : undefined}
				/>

				{#if $errors.reason}<span class="text-red-500">{$errors.reason}</span>{/if}
			</div>

			<Button type="submit" class="mt-4" form="main">
				{#if $delayed}
					<LoadingBtn name="Adding Bonus" />
				{:else}
					<Plus class="h-4 w-4" />
					Add Bonus
				{/if}
			</Button>
		</form>
	</Card.Content>
</Card.Root>
