<script lang="ts">
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { SquarePen, Save } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Errors from '$lib/formComponents/Errors.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';

	const isActives = [
		{ value: true, name: 'Active' },
		{ value: false, name: 'Inactive' }
	];

	let { data } = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data.form, {
		resetForm: false,
		invalidateAll: true
	});
	import { toast } from 'svelte-sonner';
	import type { EditLeave } from './schema';
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
	$form.id = data?.id; // 1

	$form.requestDate = data?.requestDate.toLocaleDateString('en-CA'); // 3
	$form.startDate = data?.startDate.toLocaleDateString('en-CA'); // 3
	$form.endDate = data?.endDate.toLocaleDateString('en-CA'); // 3
	$form.reason = data?.reason;
	$form.status = data?.status;
	$form.rejectionReason = data?.rejectionReason ?? '';

	let image = data?.leaveLetter ?? ''; //14
</script>

<Dialog.Root>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger class="{buttonVariants({ variant: 'ghost' })} justify-self-start p-0!">
				<Dialog.Trigger
					class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					title="Edit Leave"
				>
					<SquarePen />
				</Dialog.Trigger>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Edit Leave</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
	<Dialog.Content class="w-full bg-background">
		<Dialog.Header>
			<Dialog.Title class="text-center text-4xl">Edit Leave for {data?.name}</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-128 w-full px-2 pr-4" orientation="both">
			<form
				use:enhance
				action="?/editLeave"
				id="main"
				class="flex flex-col gap-4"
				method="POST"
				enctype="multipart/form-data"
			>
				<Errors allErrors={$allErrors} />
				<input type="hidden" name="id" id="" bind:value={$form.id} />
				<InputComp
					{form}
					{errors}
					label="Select Leave Status for {data.name}"
					type="select"
					name="status"
					items={[
						{ value: 'pending', name: 'Pending Approval' },
						{ value: 'approved', name: 'Approve Leave' },
						{ value: 'rejected', name: 'Reject Leave' }
					]}
				/>
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
				{#if $form.status === 'rejected'}
					<InputComp
						label="Rejection Reason"
						name="rejectionReason"
						type="textarea"
						{form}
						{errors}
						required={false}
						placeholder="Enter Rejection Reason"
					/>
				{/if}
				<InputComp
					label="Leave Letter File"
					name="leaveLetter"
					type="file"
					{form}
					{errors}
					{image}
					required={false}
					placeholder="Upload Leave Letter File in pdf or image format"
				/>

				<Button type="submit" class="mt-4" form="main">
					{#if $delayed}
						<LoadingBtn name="Save Leave for {data?.name}" />
					{:else}
						<Save class="h-4 w-4" />

						Save Changes for {data?.name}
					{/if}
				</Button>
			</form>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
