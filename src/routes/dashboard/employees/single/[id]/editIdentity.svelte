<script lang="ts">
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';
	import { SquarePen, Save } from '@lucide/svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	const genders = [
		{ value: 'male', name: 'Male' },
		{ value: 'female', name: 'Female' }
	];

	let {
		data,
		firstName,
		fatherName,
		grandFatherName,
		gender,
		birthDate
	}: {
		data: SuperValidated<Infer<EditIdentity>>;
		firstName: string;
		fatherName: string;
		grandFatherName: string;
		gender: string;
		birthDate: Date;
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

	$form.firstName = firstName;
	$form.fatherName = fatherName;
	$form.grandFatherName = grandFatherName;
	$form.gender = gender;
	$form.birthDate = birthDate.toLocaleDateString('en-CA');
</script>

<DialogComp title="Edit" variant="default" IconComp={SquarePen}>
	<form
		id="main"
		action="?/editIdentity"
		class="flex w-full! min-w-full! flex-col items-center justify-center gap-3"
		use:enhance
		method="post"
		enctype="multipart/form-data"
	>
		<InputComp label="Name" name="firstName" type="text" {form} {errors} required />
		<InputComp label="Father Name" name="fatherName" type="text" {form} {errors} required />
		<InputComp
			label="Grand Father Name"
			name="grandFatherName"
			type="text"
			{form}
			{errors}
			required
		/>
		<InputComp
			label="Gender"
			name="gender"
			type="select"
			{form}
			{errors}
			required
			items={genders}
		/>
		<InputComp label="Birth Date" name="birthDate" type="date" {form} {errors} required oldDays />

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
