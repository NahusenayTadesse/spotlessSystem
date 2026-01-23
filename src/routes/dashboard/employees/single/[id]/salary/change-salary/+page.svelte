<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Pen, Percent, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { salaryChangeSchema as schema } from './schema';
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
			validators: zod4Client(schema),

			onResult() {
				updateFlash(page);
			},

			onError() {
				updateFlash(page);
			}
		}
	);

	export const snapshot: Snapshot = { capture, restore };

	let current = data?.salaryDetail?.baseSalary;
	let percentage = $state(0);
	let amount = $state(0);

	let byPercent = $state(true);

	//   let newPercetage =
	function onclick() {
		byPercent = !byPercent;
		$form.amount = String(current);
	}

	function oninput() {
		if (byPercent) $form.amount = (percentage / 100) * Number(current) + Number(current);
		else $form.amount = amount + Number(current);
	}

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

<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
	<Card.Header>
		<Card.Title class="text-2xl">Change Salary for {data.salaryDetail.name}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-4">
			<div class="flex flex-row gap-2">
				<Button variant={byPercent ? 'default' : 'outline'} {onclick}
					><Percent /> Increase By Percentage</Button
				>
				<Button variant={!byPercent ? 'default' : 'outline'} {onclick}
					><Plus /> Increase By Amount</Button
				>
			</div>

			<div class="flex flex-col gap-4">
				{#if byPercent}
					<Label>Increase By Percentage</Label>

					<Input type="number" {oninput} bind:value={percentage}></Input>
				{:else}
					<Label>Increase By Amount</Label>

					<Input type="number" {oninput} step="100" bind:value={amount}></Input>
				{/if}
			</div>
			<!-- Amount field with built-in calculator -->

			<form use:enhance action="?/changeSalary" id="main" class="flex flex-col gap-4" method="post">
				<Errors allErrors={$allErrors} />

				<h4>
					Current Salary <bold class="font-bold!"
						>ETB {Number(data.salaryDetail.baseSalary).toFixed(2)}</bold
					>
				</h4>
				<h5>
					Calculating New Salary By <bold class="font-bold! text-red-500">
						{byPercent ? 'Percentage' : 'Amount'}</bold
					>
				</h5>

				{@render fe('New Salary Amount', 'amount', 'number', 'Enter the amount ', true, '0')}

				<Button type="submit" class="mt-4" form="main">
					{#if $delayed}
						<LoadingBtn name="Updating Salary" />
					{:else}
						<Pen class="h-4 w-4" />
						Change Salary
					{/if}
				</Button>
			</form>
		</div>
	</Card.Content>
</Card.Root>
