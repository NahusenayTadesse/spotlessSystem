<script lang="ts">
	import type { Snapshot } from '@sveltejs/kit';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import { page } from '$app/state';

	import { Plus, ArrowBigLeft } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { addLeave as schema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Errors from '$lib/formComponents/Errors.svelte';

	let { data } = $props();

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
	import FormCard from '$lib/formComponents/FormCard.svelte';
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
	<title>Add New Customer</title>
</svelte:head>

<Button href="/dashboard/employees/single/{page.params.id}" class="mb-6"
	><ArrowBigLeft /> Back to {data?.staffMember?.firstName}</Button
>

<FormCard
	title="Leave for {data?.staffMember?.firstName} {data?.staffMember?.fatherName}"
	description="Add a leave for {data?.staffMember?.firstName} {data?.staffMember?.fatherName}"
>
	<form
		use:enhance
		action="?/addLeave"
		id="main"
		class="flex flex-col gap-4"
		method="POST"
		enctype="multipart/form-data"
	>
		<Errors allErrors={$allErrors} />

		<InputComp
			label="Leave Request Date"
			name="requestDate"
			type="date"
			{form}
			{errors}
			required={true}
			placeholder="Enter Leave Request Date"
		/>
		<InputComp
			label="Leave Start Date"
			name="startDate"
			type="date"
			{form}
			{errors}
			required={true}
			placeholder="Enter Leave Start Date"
		/>
		<InputComp
			label="Leave End Date"
			name="endDate"
			type="date"
			{form}
			{errors}
			required={true}
			placeholder="Enter Leave End Date"
		/>
		<InputComp
			label="Reason"
			name="reason"
			type="textarea"
			{form}
			{errors}
			required={true}
			placeholder="Enter Reason for Leave"
		/>
		<InputComp
			label="Leave Letter File"
			name="leaveLetter"
			type="file"
			{form}
			{errors}
			required={false}
			placeholder="Upload Leave Letter File in pdf or image format"
		/>

		<Button type="submit" class="mt-4" form="main">
			{#if $delayed}
				<LoadingBtn
					name="Adding Leave for {data?.staffMember?.firstName} {data?.staffMember?.fatherName}"
				/>
			{:else}
				<Plus class="h-4 w-4" />

				Add leave for {data?.staffMember?.firstName}
				{data?.staffMember?.fatherName}
			{/if}
		</Button>
	</form>
</FormCard>
