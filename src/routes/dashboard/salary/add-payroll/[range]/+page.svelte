<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import { Frown, Loader } from '@lucide/svelte';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
	import Filter from '$lib/components/Table/FilterMenu.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	let filteredList = $derived(data?.payrollData);

	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { payrollSchema as schema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Errors from '$lib/formComponents/Errors.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	const { form, errors, enhance, delayed, allErrors, capture, restore, message } = superForm(
		data.form,
		{
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

	$form.start = data?.start;
	$form.end = data?.end;
</script>

<svelte:head>
	<title>UnPaid Salaries</title>
</svelte:head>

{#await data?.payrollData}
	<div class="flex justify-center p-10">
		<Loader class="animate-spin" />
	</div>
{:then payrollData}
	{#if data.payrollData.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />

				Transactions is Empty for this Date Range Choose Another Range
			</p>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<h2 class="my-4 text-2xl">No of Salaries {filteredList?.length}</h2>
			<form method="POST" action="?/runPayroll" use:enhance>
				<InputComp type="select" label="Month" name="month" {form} {errors} />
				<InputComp type="hidden" label="" name="start" {form} {errors} />
				<InputComp type="hidden" label="" name="end" {form} {errors} />
				<InputComp type="hidden" label="" name="payrollData" {form} {errors} />

				<input type="hidden" name="payrollData" value={JSON.stringify(filteredList)} />

				<Button type="submit">Finalise Payroll for Filtered Employees {filteredList?.length}</Button
				>
			</form>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />

			<Filter
				data={data?.payrollData}
				bind:filteredList
				filterKeys={[
					'employmentStatus',
					'absent',
					'bank',
					'department',
					'overtime',
					'basicSalary',
					'housingAllowance',
					'transportAllowance',
					'positionAllowance'
				]}
			/>

			<DataTable data={filteredList} class="w-6xl!" {columns} fileName="Bank Accounts" />
		</div>
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
