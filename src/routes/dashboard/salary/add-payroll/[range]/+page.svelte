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
	import { payrollSchema as schema, type EmployeeFormType } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Errors from '$lib/formComponents/Errors.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	const { form, errors, enhance, delayed, allErrors, capture, restore, message } = superForm(
		data.form,
		{
			validators: zod4Client(schema),
			dataType: 'json'
		}
	);

	export const snapshot: Snapshot = { capture, restore };

	import { toast } from 'svelte-sonner';
	import FormCard from '$lib/formComponents/FormCard.svelte';
	import PayrollTotals from './payroll-totals.svelte';
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

	$effect(() => {
		$form.employees = $form.employees = filteredList.map(
			(emp): EmployeeFormType => ({
				...emp,
				// Ensure numeric fields from LEFT JOINs aren't null
				positionAllowance: emp.positionAllowance ?? 0,
				housingAllowance: emp.housingAllowance ?? 0,
				transportAllowance: emp.transportAllowance ?? 0,
				nonTaxable: emp.nonTaxable ?? 0,
				overtime: emp.overtime ?? 0,
				bonus: emp.bonus ?? 0,
				absent: emp.absent ?? 0,
				attendancePenality: emp.attendancePenality ?? 0,
				commission: emp.commission ?? 0,
				deductions: emp.deductions ?? 0,
				gross: emp.gross ?? 0,
				taxable: emp.taxable ?? 0,
				taxAmount: emp.taxAmount ?? 0,
				netPay: emp.netPay ?? 0,
				// Ensure strings aren't null if the schema doesn't allow it
				account: emp.account ?? '',
				bank: emp.bank ?? '',
				employmentStatus: emp.employmentStatus ?? ''
			})
		);
	});

	export const calculateTotal = (
		employees: EmployeeFormType[],
		key: keyof EmployeeFormType
	): number => {
		const total = employees.reduce((sum, emp) => {
			const value = emp[key];
			// Ensure we only add actual numbers (safety check)
			return sum + (typeof value === 'number' ? value : 0);
		}, 0);

		// Round to 2 decimal places to avoid floating point errors
		return Math.round(total * 100) / 100;
	};

	let totals = $derived({
		gross: calculateTotal($form.employees, 'gross'),
		tax: calculateTotal($form.employees, 'taxAmount'),
		penalty: calculateTotal($form.employees, 'attendancePenality'),
		netPay: calculateTotal($form.employees, 'netPay'),
		overtime: calculateTotal($form.employees, 'overtime')
	});

	let month = $state('');

	import MonthYear from '$lib/formComponents/MonthYear.svelte';
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

				<InputComp type="hidden" label="Month" name="month" {form} {errors} required />
				<MonthYear bind:value={$form.month} />

				<InputComp label={$form.employees.length} type="hidden" name="employees" {form} {errors} />

				<Button type="submit">
					Finalise Payroll for Filtered Employees {filteredList?.length}</Button
				>
			</form>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />
			<PayrollTotals {totals} />
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
