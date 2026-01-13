<script lang="ts">
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editStaff } from '$lib/zodschemas/appointmentSchema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';

	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Pencil, Plus, Save, Trash } from '@lucide/svelte';
	import type { Snapshot } from '@sveltejs/kit';

	import Delete from '$lib/forms/Delete.svelte';

	import SingleView from '$lib/components/SingleView.svelte';

	let singleTable = $derived([
		// Identity
		{
			name: 'Full Name',
			value: `${data.staffMember?.firstName} ${data.staffMember?.lastName} ${data.staffMember?.grandFatherName}`
		},
		{ name: 'Gender', value: data.staffMember?.gender },
		{ name: 'Birth Date', value: formatEthiopianDate(data.staffMember?.birthDate) },
		{ name: 'Age', value: data.staffMember?.age + ' years old' },
		{ name: 'Nationality', value: data.staffMember?.nationality },

		// Personal details
		{ name: 'Marital Status', value: data.staffMember?.maritalStatus },
		{ name: 'Religion', value: data.staffMember?.religion },
		{ name: 'Blood Type', value: data.staffMember?.bloodType },

		// Education
		{ name: 'Educational Level', value: data.staffMember?.educationalLevel },

		// Employment details
		{ name: 'Employment Status', value: data.staffMember?.status },
		{ name: 'Department', value: data.staffMember?.department },
		{ name: 'Hired On', value: formatEthiopianDate(new Date(data.staffMember?.hireDate)) },
		{ name: 'Years of Service', value: data.staffMember?.years + ' years' },

		// Administrative / system info
		{ name: 'Tin Number', value: data.staffMember?.tinNo },
		{ name: 'Added By', value: data.staffMember?.addedBy }
	]);

	const { form, errors, enhance, delayed, capture, restore, message } = superForm(data.form, {
		validators: zod4Client(editStaff),
		resetForm: false
	});

	import { toast } from 'svelte-sonner';
	import { formatEthiopianDate } from '$lib/global.svelte.js';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});

	export const snapshot: Snapshot = { capture, restore };

	let edit = $state(false);
</script>

<svelte:head>
	<title>
		{data.staffMember?.firstName}
		{data.staffMember?.lastName}
	</title>
</svelte:head>

<SingleView title="Staff Details">
	<div class="mt-4 flex w-full flex-row items-start justify-start gap-2 pl-4">
		<Button onclick={() => (edit = !edit)}>
			{#if !edit}
				<Pencil class="h-4 w-4" />
				Edit
			{:else}
				<ArrowLeft class="h-4 w-4" />

				Back
			{/if}
		</Button>
		<Delete redirect="/dashboard/employees" />
	</div>
	<div class="w-full p-4"><SingleTable {singleTable} /></div>
</SingleView>
