<script lang="ts">
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';
	import { SquarePen, Save } from '@lucide/svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	const relationShips = [
		{ value: 'mother', name: 'Mother' },
		{ value: 'father', name: 'Father' },
		{ value: 'spouse', name: 'Spouse' },
		{ value: 'brother', name: 'Brother' },
		{ value: 'sister', name: 'Sister' },
		{ value: 'son', name: 'Son' },
		{ value: 'daughter', name: 'Daughter' },
		{ value: 'other', name: 'Other' }
	];

	import { type AddGuarantor } from './schema';

	let {
		data
	}: {
		data: SuperValidated<Infer<AddGuarantor>>;
	} = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false,
		invalidateAll: true
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
</script>

<DialogComp title="Add Guarantor" variant="default" IconComp={SquarePen}>
	<form
		id="main"
		action="?/addGuarantor"
		class="flex w-full! min-w-full! flex-col items-center justify-center gap-3"
		use:enhance
		method="post"
		enctype="multipart/form-data"
	>
		<input type="hidden" name="id" bind:value={$form.id} />
		<InputComp
			label="Name"
			name="name"
			type="text"
			placeholder="Enter name"
			{form}
			{errors}
			required
		/>
		<InputComp
			label="Phone"
			name="phone"
			type="tel"
			placeholder="Enter phone number"
			{form}
			{errors}
			required
		/>
		<InputComp
			label="Email"
			name="email"
			type="email"
			placeholder="Enter email address"
			{form}
			{errors}
		/>
		<InputComp
			label="Job Type"
			name="jobType"
			type="text"
			placeholder="Enter job type"
			{form}
			{errors}
			required
		/>
		<InputComp
			label="Company"
			name="company"
			type="text"
			placeholder="Enter company name"
			{form}
			{errors}
			required
		/>
		<InputComp
			label="Salary"
			name="salary"
			type="text"
			placeholder="Enter salary"
			{form}
			{errors}
			required
		/>

		<InputComp
			label="Relationship to Employee"
			name="relationship"
			type="select"
			{form}
			{errors}
			items={relationShips}
			required
		/>

		{#if $form.relationship === 'other'}
			<InputComp
				label="Other Relationship"
				name="relation"
				type="text"
				placeholder="Enter other relationship"
				{form}
				{errors}
				required
			/>
		{/if}

		<InputComp
			label="Photo"
			name="photo"
			type="file"
			{form}
			{errors}
			placeholder="Upload a 3 X 4 photo of Guarantor"
			required
		/>
		<InputComp
			label="Document"
			name="document"
			type="file"
			{form}
			{errors}
			placeholder="Upload a document related to Guarantor"
			required
		/>
		<InputComp
			label="Goverment Id"
			name="govtId"
			type="file"
			{form}
			{errors}
			placeholder="Upload a government ID(FIDA) of Guarantor"
			required
		/>

		<Errors allErrors={$allErrors} />
		<Button type="submit" class="w-full" form="main" variant="default">
			{#if $delayed}
				<LoadingBtn name="Saving Changes" />
			{:else}
				<Save class="h-4 w-4" />
				Save Changes
			{/if}
		</Button>
	</form>
</DialogComp>
