<script lang="ts">
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { Plus, Save, Send, SquarePenIcon } from '@lucide/svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Add } from './schema';
	import DialogComp from '$lib/formComponents/DialogComp.svelte';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Errors from '$lib/formComponents/Errors.svelte';

	let {
		data,
		siteId,
		penality,
		rejectedReason,
		requestedBy,
		employees,
		month,
		year,
		requestDate
	}: {
		data: SuperValidated<Infer<Add>>;
		siteId: number;
		employees: Item[];
		requestedBy: number;
		month: string;
		year: number;
		penality?: number;
		rejectedReason?: string;
		requestDate: Date;
	} = $props();
	let open = $state(false);
	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false
	});

	import { toast } from 'svelte-sonner';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import type { Item } from '$lib/global.svelte';
	import MonthYear from '$lib/formComponents/MonthYear.svelte';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});
	$form.id = siteId;
	$form.penality = penality ?? 0;
	$form.rejectedReason = rejectedReason ?? '';
	$form.requestDate = requestDate.toLocaleDateString('en-CA');
	$form.month = month + '_' + year;
	$form.requestedBy = requestedBy;
</script>

<form
	use:enhance
	method="post"
	class="flex w-lg flex-col gap-2"
	action="?/request"
	id="request"
	enctype="multipart/form-data"
>
	<Errors allErrors={$allErrors} />
	{#if $message}
		<p class="text-sm text-zinc-500">{@html $message.text}</p>
	{/if}
	<input bind:value={$form.id} name="id" type="hidden" />
	<InputComp
		{form}
		{errors}
		type="select"
		label="Status"
		name="status"
		items={[{ value: 'pending', name: 'Send to Pending' }]}
	/>

	<InputComp
		type="textarea"
		disabled
		label="Rejected Reason"
		name="rejectedReason"
		{form}
		{errors}
	/>

	<InputComp type="number" label="Penality" name="penality" {form} {errors} />
	<div>
		<InputComp type="hidden" label="Month" name="month" {form} {errors} required />
		<MonthYear bind:value={$form.month} />
	</div>
	<InputComp type="date" label="Request Date" name="requestDate" {form} {errors} />
	<InputComp type="combo" label="Requestor" name="requestedBy" {form} {errors} items={employees} />

	<Button type="submit" class="w-full" form="request" variant="default">
		{#if $delayed}
			<LoadingBtn name="Sending to Pending" />
		{:else}
			<Send class="h-4 w-4" />
			Send to Pending
		{/if}
	</Button>
</form>
